function computeTrajectory(v0, thetaDeg, phiDeg, y0, g) {
    const theta = thetaDeg * Math.PI / 180;
    const phi   = phiDeg   * Math.PI / 180;
 
    const v0x = v0 * Math.cos(theta) * Math.cos(phi);
    const v0y = v0 * Math.sin(theta);
    const v0z = v0 * Math.cos(theta) * Math.sin(phi);
 
    const disc = v0y * v0y + 2 * g * y0;
    if (disc < 0) return null;
    const T = (v0y + Math.sqrt(disc)) / g;
 
    const H = y0 + v0y * v0y / (2 * g);
    const D = v0 * v0 * Math.sin(2 * theta) / g;
 
    const N = 500, dt = T / N;
    const points = [];
    for (let i = 0; i <= N; i++) {
        const t = i * dt;
        points.push({
            x: v0x * t,
            y: Math.max(0, y0 + v0y * t - 0.5 * g * t * t),
            z: v0z * t
        });
    }
 
    return { v0x, v0y, v0z, T, H, D, points };
}