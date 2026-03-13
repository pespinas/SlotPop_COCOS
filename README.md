# 🎰 PokéSlot: Legendary Ruins

[![Cocos Creator](https://img.shields.io/badge/Cocos%20Creator-3.x-blueviolet)](https://www.cocos.com/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)](https://www.typescriptlang.org/)
[![Architecture](https://img.shields.io/badge/Architecture-Clean%20Architecture-green)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

Un prototipo de **Slot de Cascada (Avalancha)** de alto rendimiento desarrollado en **Cocos Creator 3.x**. El proyecto utiliza iconos de Pokémon y físicas de gravedad real, destacando por una separación total entre la lógica matemática y la visualización gráfica.

---

## 🏗️ Arquitectura del Software (Clean Architecture)

El núcleo de este proyecto es la **independencia del framework**. La lógica de premios y probabilidades podría funcionar en una consola de comandos o en un servidor sin necesidad de Cocos Creator.

### Capas de Dependencia:
1.  **Domain (Círculo Amarillo):** Entidades y lógica pura. Contiene el `SymbolRNG.ts` para la generación de resultados basada en pesos probabilísticos.
2.  **Application (Círculo Rojo):** Casos de uso. Aquí reside el `PrizesController.ts`, encargado del algoritmo de detección de adyacentes (3+ figuras iguales).
3.  **Infrastructure (Círculo Verde):** Adaptadores. El `EventManager.ts` actúa como puente de comunicación asíncrona mediante el patrón Observer.
4.  **Presentation (Círculo Azul):** La capa de Cocos Creator. `SymbolItem.ts` gestiona los `RigidBody2D`, `PhysicsCollider` y la actualización de `SpriteFrames`.

---

## 🎮 Mecánicas de Juego y "Game Feel"

* **Cuadrícula 3x4:** El área de juego visible consta de 3 columnas y 4 filas.
* **Físicas de Gravedad:** A diferencia de los slots tradicionales, los símbolos son objetos físicos que caen y colisionan. Se utiliza el motor **Box2D** integrado.
* **Algoritmo de Premios (Adjacent Match):** El sistema escanea el tablero buscando grupos de 3 o más símbolos conectados horizontal o verticalmente.
* **Cascadas (Chain Reactions):** 1.  Las combinaciones ganadoras se eliminan.
    2.  Se activa un evento de explosión (VFX).
    3.  Los símbolos superiores caen por gravedad.
    4.  Nuevos símbolos se instancian en la parte superior para rellenar el tablero.

---

## 🛠️ Stack Técnico y Herramientas

* **Engine:** Cocos Creator 3.x (Sistema de componentes y nodos).
* **Físicas:** RigidBody2D + BoxCollider2D.
* **Lenguaje:** TypeScript (Tipado estricto para modelos de datos).
* **Assets:** Sprite Atlas para optimización de llamadas de dibujado (Draw Calls).
* **UI:** Sistema de layouts dinámicos para adaptación a pantallas móviles.

---

## 📂 Estructura del Proyecto

```text
assets/
├── Atlas/             # Spritesheets de Pokémon y UI
├── Scenes/            # Escena principal de juego
└── Scripts/
    ├── Domain/        # Modelos de datos y Generador Aleatorio (RNG)
    ├── Application/   # Controlador de Premios y Lógica de Juego
    ├── Infrastructure/# Event Manager y Tipos de Eventos
    └── Presentation/  # Controladores de Sprites, Físicas y Animaciones
```
