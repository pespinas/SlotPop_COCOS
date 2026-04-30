export class NoiseGenerator{
    private gradients: { [key: string]: { x: number, y: number } } = {};
    private memory: { [key: string]: number } = {};

    constructor() {
        this.seed();
    }

    public seed(): void {
        this.gradients = {};
        this.memory = {};
    }

    private rand_vect(): { x: number, y: number } {
        let theta = Math.random() * 2 * Math.PI;
        return { x: Math.cos(theta), y: Math.sin(theta) };
    }

    private dot_prod_grid(x: number, y: number, vx: number, vy: number): number {
        let g_vect;
        let d_vect = { x: x - vx, y: y - vy };
        let key = `${vx},${vy}`;

        if (this.gradients[key]) {
            g_vect = this.gradients[key];
        } else {
            g_vect = this.rand_vect();
            this.gradients[key] = g_vect;
        }
        return d_vect.x * g_vect.x + d_vect.y * g_vect.y;
    }

    private smootherstep(x: number): number {
        return 6 * Math.pow(x, 5) - 15 * Math.pow(x, 4) + 10 * Math.pow(x, 3);
    }

    private interp(x: number, a: number, b: number): number {
        return a + this.smootherstep(x) * (b - a);
    }

    public get(x: number, y: number): number {
        let key = `${x},${y}`;
        if (this.memory.hasOwnProperty(key)) return this.memory[key];

        let xf = Math.floor(x);
        let yf = Math.floor(y);

        let tl = this.dot_prod_grid(x, y, xf, yf);
        let tr = this.dot_prod_grid(x, y, xf + 1, yf);
        let bl = this.dot_prod_grid(x, y, xf, yf + 1);
        let br = this.dot_prod_grid(x, y, xf + 1, yf + 1);

        let xt = this.interp(x - xf, tl, tr);
        let xb = this.interp(x - xf, bl, br);
        let v = this.interp(y - yf, xt, xb);

        this.memory[key] = v;
        return v;
    }
}

