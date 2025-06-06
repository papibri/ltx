const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || '';

// Middleware para manejar la ruta base en GitHub Pages
app.use((req, res, next) => {
    req.baseUrl = BASE_URL;
    next();
});

// Configuración de CORS
app.use(cors());

// Middleware para archivos estáticos
app.use(express.static(path.join(__dirname)));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Ruta principal que maneja el base path
app.get('*', (req, res) => {
    if (req.path === '/' || req.path === '/index.html') {
        res.sendFile(path.join(__dirname, 'markdown-latex-pdf-editor.html'));
    } else {
        next();
    }
});

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['text/plain', 'text/markdown', 'application/x-tex'];
        if (allowedTypes.includes(file.mimetype) || file.originalname.endsWith('.md') || file.originalname.endsWith('.tex')) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de archivo no permitido'), false);
        }
    }
});

// Base de datos en memoria (en producción usar MongoDB, PostgreSQL, etc.)
let documents = new Map();
let nextId = 1;

// Crear directorios necesarios
async function createDirectories() {
    try {
        await fs.mkdir('uploads', { recursive: true });
        await fs.mkdir('exports', { recursive: true });
        await fs.mkdir('data', { recursive: true });
    } catch (error) {
        console.error('Error creando directorios:', error);
    }
}

// Cargar datos persistentes
async function loadData() {
    try {
        const data = await fs.readFile('data/documents.json', 'utf8');
        const parsed = JSON.parse(data);
        documents = new Map(parsed.documents || []);
        nextId = parsed.nextId || 1;
        console.log(`Cargados ${documents.size} documentos`);
    } catch (error) {
        console.log('No se encontraron datos previos, iniciando con base de datos vacía');
    }
}

// Guardar datos
async function saveData() {
    try {
        const data = {
            documents: Array.from(documents.entries()),
            nextId: nextId
        };
        await fs.writeFile('data/documents.json', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error guardando datos:', error);
    }
}

// Middleware para validación
const validateDocument = (req, res, next) => {
    const { title, content, format } = req.body;
    
    if (!content || typeof content !== 'string') {
        return res.status(400).json({
            success: false,
            error: 'El contenido es requerido y debe ser un string'
        });
    }
    
    if (format && !['markdown', 'latex'].includes(format)) {
        return res.status(400).json({
            success: false,
            error: 'El formato debe ser "markdown" o "latex"'
        });
    }
    
    next();
};

// Middleware para logging
const logRequest = (req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
};

app.use(logRequest);

// Rutas API
app.post('/api/documents', validateDocument, async (req, res) => {
    try {
        const { title, content, format } = req.body;
        const id = nextId++;
        const document = {
            id,
            title: title || `Documento ${id}`,
            content,
            format: format || 'markdown',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        documents.set(id, document);
        await saveData();
        
        res.json({
            success: true,
            document
        });
    } catch (error) {
        console.error('Error al crear documento:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

app.get('/api/documents', async (req, res) => {
    try {
        res.json({
            success: true,
            documents: Array.from(documents.values())
        });
    } catch (error) {
        console.error('Error al obtener documentos:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

app.get('/api/documents/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const document = documents.get(id);
        
        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Documento no encontrado'
            });
        }
        
        res.json({
            success: true,
            document
        });
    } catch (error) {
        console.error('Error al obtener documento:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

app.put('/api/documents/:id', validateDocument, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const document = documents.get(id);
        
        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Documento no encontrado'
            });
        }
        
        const { title, content, format } = req.body;
        const updatedDocument = {
            ...document,
            title: title || document.title,
            content: content,
            format: format || document.format,
            updatedAt: new Date()
        };
        
        documents.set(id, updatedDocument);
        await saveData();
        
        res.json({
            success: true,
            document: updatedDocument
        });
    } catch (error) {
        console.error('Error al actualizar documento:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

app.delete('/api/documents/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const document = documents.get(id);
        
        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Documento no encontrado'
            });
        }
        
        documents.delete(id);
        await saveData();
        
        res.json({
            success: true,
            message: 'Documento eliminado correctamente'
        });
    } catch (error) {
        console.error('Error al eliminar documento:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Ruta para subida de archivos
app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No se ha proporcionado ningún archivo'
            });
        }

        const fileContent = await fs.readFile(req.file.path, 'utf8');
        const format = req.file.originalname.endsWith('.md') ? 'markdown' : 'latex';
        
        const id = nextId++;
        const document = {
            id,
            title: req.file.originalname,
            content: fileContent,
            format,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        documents.set(id, document);
        await saveData();
        
        res.json({
            success: true,
            document
        });
    } catch (error) {
        console.error('Error al procesar archivo:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Inicialización y arranque del servidor
async function initServer() {
    await createDirectories();
    await loadData();
    
    app.listen(PORT, () => {
        console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
}

initServer().catch(error => {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
});