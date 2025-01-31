# 🏡 Simple 3D Viewer 🚀

**Visualizador de modelos 3D exportados en formato OBJ, desarrollado con Three.js sin frameworks.**

📌 **Características principales:**

✅ Interfaz moderna y profesional con fondo oscuro.
✅ Controles de órbita suaves con zoom y rotación.
✅ Iluminación realista con sombras y luces direccionales.
✅ Botones para cambiar entre vistas predefinidas (Frontal, Lateral, Superior).
✅ Animaciones suaves en los cambios de cámara.
✅ Carga elegante con efecto de fade-out.

---

## 🎬 **Proyecto**

📷 **Logo:**
![Simple 3D Viewer](https://raw.githubusercontent.com/appjava/simple3d/refs/heads/main/src/images/logo.png)

📌 **Prueba en vivo:** [🔗 Online](https://appjava.github.io/simple3d/)*.*

---

## 🚀 **Instalación y Uso**

### 🔧 1️⃣ **Clona el repositorio**

```bash
git clone https://github.com/appjava/simple3d.git
cd simple3d
```

### 🌍 2️⃣ **Abre en el navegador**

Si tienes **Live Server** en VS Code:

1. Abre el proyecto en **Visual Studio Code**.
2. Haz clic derecho en `index.html` → **"Open with Live Server"**.

O simplemente abre el archivo `index.html` en tu navegador.

---

## 🏗 **Estructura del Proyecto**

```
/simple3d
│── models/         # Carpeta donde van los archivos .obj y .mtl
│── src/            # Imagenes, estilos y scripts 
│── index.html      # Archivo principal
└── README.md       # Este archivo con la documentación
```

---

## 🎮 **Controles**

| Acción                                | Descripción                                    |
| -------------------------------------- | ----------------------------------------------- |
| 🖱**Clic izquierdo + arrastrar** | Rotar modelo                                    |
| 🔍**Rueda del mouse**            | Zoom in/out                                     |
| 🖱**Clic derecho + arrastrar**   | Mover modelo                                    |
| 🎯**Botones de vista**           | Cambiar entre vista frontal, lateral y superior |

---

## 📌 **Tecnologías Usadas**

🔹 **Three.js** – Motor de gráficos 3D en WebGL.
🔹 **JavaScript Vanilla** – Sin frameworks, código ligero y optimizado.
🔹 **HTML + CSS** – Interfaz moderna y responsive.

---

## 🛠 **Personalización**

Si deseas cargar tu propio modelo exportado desde un software CAD 3D:

1. Guarda el modelo en formato `.obj` y `.mtl`.
2. Coloca los archivos en la carpeta `model/`.
3. Modifica estas líneas en `script.js`:
   ```js
   loadModel("models/model.mtl", "models/model.obj");
   ```

---

## 🎯 **Roadmap / Mejoras Futuras**

🔹 Agregar compatibilidad con más formatos (GLTF, FBX).
🔹 Integrar una opción de cambio de texturas en tiempo real.
🔹 Incluir herramientas de medición dentro del modelo.
🔹 Cargar modelos directamente em pantalla.

---

## 👨‍💻 **Contribuciones**

¡Las contribuciones son bienvenidas! Si tienes ideas o mejoras:

1. **Haz un fork** del proyecto.
2. **Crea una nueva rama** (`git checkout -b feature-nueva`).
3. **Sube tus cambios** (`git commit -m "Agregada nueva función"`).
4. **Envía un Pull Request**.

---

## 📄 **Licencia**

Este proyecto está bajo la licencia **MIT**, por lo que puedes usarlo, modificarlo y compartirlo libremente.

---

💡 **Si te gustó este proyecto, dale una ⭐ en GitHub y compártelo!** 🚀
