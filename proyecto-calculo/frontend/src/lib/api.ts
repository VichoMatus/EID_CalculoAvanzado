const API_BASE = 'http://localhost:5000/api';

export async function calculate(x: number, y: number) {
  const res = await fetch(`${API_BASE}/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ x, y }),
  });
  return res.json();
}

export async function getSurface() {
  const res = await fetch(`${API_BASE}/surface`);
  return res.json();
}

export async function optimize(initialX: number, initialY: number) {
  const res = await fetch(`${API_BASE}/optimize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ x: initialX, y: initialY }),
  });
  return res.json();
}
