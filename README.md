# 🎰 PokéSlot: Legendary Ruins

[![Cocos Creator](https://img.shields.io/badge/Cocos%20Creator-3.x-blueviolet)](https://www.cocos.com/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)](https://www.typescriptlang.org/)
[![Architecture](https://img.shields.io/badge/Architecture-Clean%20Architecture-green)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

Un prototipo de **Slot de Cascada (Avalancha)** de alto rendimiento desarrollado en **Cocos Creator 3.x**. El proyecto utiliza iconos de Pokémon y físicas de gravedad real, destacando por una separación total entre la lógica matemática, las reglas del juego y la visualización gráfica.

---

## 🏗️ Arquitectura del Software (Clean Architecture)

El núcleo de este proyecto es la **independencia del framework**. Toda la lógica de premios, probabilidades y estados del juego podría funcionar en una consola de comandos o en un servidor sin necesidad de Cocos Creator.

### Capas de Dependencia:

1. **Domain (Círculo Amarillo):** Entidades y lógica pura del negocio. Contiene el `SymbolRNG.ts` para la generación de resultados basada en pesos probabilísticos y el **`WallState.ts`**, un Singleton que gestiona la estamina del muro y el consumo de energía de las herramientas de excavación de forma persistente.
2. **Application (Círculo Rojo):** Casos de uso. Aquí reside el `PrizesController.ts`, encargado del algoritmo de detección de adyacentes (3+ figuras iguales) y las reglas de transición hacia los modos especiales.
3. **Infrastructure (Círculo Verde):** Adaptadores y servicios globales. El `EventManager.ts` actúa como puente de comunicación asíncrona mediante el patrón Observer.
4. **Presentation (Círculo Azul):** La capa visual de Cocos Creator. Los componentes gestionan los `RigidBody2D`, los efectos de transición de pantalla (*Fade In / Fade Out*) y la actualización de los nodos en el Canvas de excavación.

<img width="772" height="567" alt="1_wOmAHDN_zKZJns9YDjtrMw" src="https://github.com/user-attachments/assets/39acd779-9dd5-490c-926d-a23f7505c7d9" />


---

## 🎮 Mecánicas de Juego y "Game Feel"

### Juego Base: Rodillos de Avalancha
* **Cuadrícula 3x4:** El área de juego consta de 3 columnas por 4 filas visibles.
* **Gravedad Simulada (Tweens):** Los símbolos caen desde la parte superior utilizando curvas de aceleración (*Easing functions*) para emular de forma controlada el efecto de la gravedad.
* **Algoritmo de Premios (Adjacent Match):** El sistema escanea el tablero buscando grupos de **3 o más símbolos iguales** conectados de forma horizontal o vertical.
* **Reacciones en Cadena (Avalancha):** Las combinaciones ganadoras estallan y se eliminan, permitiendo que los símbolos superiores caigan para llenar los huecos y entren nuevas figuras desde la parte superior, acumulando ganancias en una misma tirada.

### Modo Bonus: Minijuego de Excavación Subterránea
* **Activación por Cadena:** Cuando el jugador logra encadenar múltiples reacciones de avalancha consecutivas en una sola tirada y supera un umbral de ganancias establecido ($x$), se desbloquea el **Modo Bonus**. El juego realiza una transición fluida mediante pantallas de carga con fundido a negro (*Fade In/Out*).
* **Mecánica de Picado:** El jugador se enfrenta a un muro de roca agrietado que oculta tesoros. Dispondrá de herramientas tradicionales (como el pico y el martillo) para golpear las diferentes secciones de la pared.
* **Gestión de Estamina:** El muro posee una barra de resistencia (*Stamina*) limitada. Cada golpe con el martillo o el pico inflige daño a la pared pero consume energía a ritmos diferentes.
* **Colapso del Muro:** El objetivo es desenterrar la mayor cantidad de **gemas preciosas** posibles antes de que la estamina llegue a cero. En el momento en que el muro se queda sin energía, este se desploma por completo, dando por finalizado el Bonus.
* **Impacto en el Balance:** Todas las gemas descubiertas con éxito durante la excavación se tasan y se suman directamente al balance de créditos principal del jugador al regresar al slot.

---

## 🛠️ Stack Técnico y Herramientas

* **Engine:** Cocos Creator 3.x.
* **Animación:** Sistema de `tween()` para el movimiento de caída, efectos de rebote (*Elastic/Bounce*) y transiciones de opacidad (*UIOpacity*) entre escenas.
* **Lenguaje:** TypeScript (Tipado estricto).
* **Optimización:** Uso de Sprite Atlas para reducir el Draw Call y mejorar el rendimiento en dispositivos móviles.

---

## 📂 Estructura del Proyecto

```text
assets/
├── Atlas/             # Spritesheets de símbolos, herramientas y UI
├── Scenes/            # Escena principal (Slot) y Escena de Bonificación (Excavación)
└── Scripts/
    ├── Domain/        # Generador Aleatorio (RNG), Modelos y Estado del Muro (WallState)
    ├── Application/   # Lógica de Premios, Reglas de Entrada a Bonus y Casos de Uso
    ├── Infrastructure/# Event Manager, Controladores de Persistencia y Tipos
    └── Presentation/  # Controladores de Sprites, Transiciones de Escena (Fade) y UI del Muro
