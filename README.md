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

* **Cuadrícula 3x4:** El área de juego consta de 3 columnas por 4 filas visibles.
* **Gravedad Simulada (Tweens):** Los símbolos caen desde la parte superior utilizando curvas de aceleración (Easing functions) para emular de forma controlada el efecto de la gravedad.
* **Algoritmo de Premios (Adjacent Match):** El sistema escanea el tablero buscando grupos de **3 o más símbolos iguales** conectados horizontal o verticalmente.
* **Reacciones en Cadena (Avalancha):** 1.  Las combinaciones ganadoras se detectan y eliminan.
    2.  Se disparan eventos de explosión y desaparición.
    3.  Los símbolos superiores se desplazan hacia abajo mediante Tweens coordinados para llenar los huecos vacíos.
    4.  Nuevos símbolos se generan fuera de pantalla y caen para completar la cuadrícula.

---

## 🛠️ Stack Técnico y Herramientas

* **Engine:** Cocos Creator 3.x.
* **Animación:** Sistema de `tween()` para el movimiento de caída y efectos de rebote (Elastic/Bounce).
* **Lenguaje:** TypeScript (Tipado estricto).
* **Optimización:** Uso de Sprite Atlas para reducir el Draw Call y mejorar el rendimiento en móviles.

---

## 📂 Estructura del Proyecto

```text
assets/
├── Atlas/             # Spritesheets de Pokémon y UI
├── Scenes/            # Escena principal de juego
└── Scripts/
    ├── Domain/        # Generador Aleatorio (RNG) y Modelos
    ├── Application/   # Lógica de Premios (Adyacentes) y Reglas
    ├── Infrastructure/# Event Manager y Tipos de Eventos
    └── Presentation/  # Controladores de Sprites y Animaciones (Tweens)
```
