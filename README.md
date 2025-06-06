# Editor Markdown/LaTeX a PDF Profesional

Una aplicación web moderna y elegante que permite editar documentos Markdown y LaTeX con vista previa en tiempo real y exportación a PDF.

![Logo Papiweb](/public/images/papiwebMarkDown.png)

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftu-usuario%2Flatex-markdown-editor)

## Demo
[Ver Demo en vivo](https://tu-usuario.github.io/latex-markdown-editor)

## Características Principales

- 📝 Editor con resaltado de sintaxis para Markdown y LaTeX
- 👁️ Vista previa en tiempo real
- 📄 Exportación a PDF de alta calidad
- ➗ Soporte completo para fórmulas matemáticas
- 🎨 Herramientas profesionales de edición de PDF:
  - Agregar texto en cualquier posición
  - Marca de agua personalizable
  - Protección con contraseña
  - Combinar PDFs
  - Dividir PDFs

## Tecnologías Utilizadas

- HTML5, CSS3 y JavaScript moderno
- CodeMirror para el editor de código
- MathJax para renderizar fórmulas matemáticas
- PDF-lib.js para manipulación de PDFs
- Express.js para el backend
- Font Awesome para iconos

## Cómo Usar

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/markdown-latex-editor.git
cd markdown-latex-editor
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor:
```bash
node rest-api-backend.js
```

4. Abre `markdown-latex-pdf-editor.html` en tu navegador web.

## Características del Editor

- **Modo Markdown y LaTeX**: Cambia fácilmente entre ambos formatos
- **Plantillas integradas**: Comienza rápidamente con plantillas predefinidas
- **Atajos de teclado**:
  - `Ctrl + S`: Guardar documento
  - `Ctrl + B`: Texto en negrita
  - `Ctrl + I`: Texto en cursiva

## API Backend

El servidor proporciona endpoints para:
- Guardar y cargar documentos
- Gestionar archivos subidos
- Procesar conversiones de formato

### Endpoints disponibles

- `POST /api/documents`: Crear nuevo documento
- `GET /api/documents`: Listar todos los documentos
- `GET /api/documents/:id`: Obtener documento específico
- `PUT /api/documents/:id`: Actualizar documento
- `DELETE /api/documents/:id`: Eliminar documento
- `POST /api/upload`: Subir archivo

## Desarrollado por

Papiweb desarrollos informáticos  
[¡Apóyanos en MercadoPago!](https://link.mercadopago.com.ar/papiweb)  
💻 Desarrollos web profesionales y soluciones informáticas