import { expect, test } from '@playwright/test';

test('el inicio dice quién soy, qué hago y cómo contactarme', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Miguel Ángel Pantoja Guerra/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Pantoja');
  // El pie repite la frase: se busca solo en el contenido principal.
  await expect(
    page.getByRole('main').getByText('Construyo apps completas: del reloj al servidor.'),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Escríbeme' })).toHaveAttribute('href', '#contacto');
  await expect(page.locator('#proyectos .proyecto')).toHaveCount(4);
});

test('se puede abrir un proyecto y pasar al siguiente', async ({ page }) => {
  await page.goto('/');
  await page.locator('#proyectos').getByRole('link', { name: 'HP: Health Points' }).click();
  await expect(page).toHaveURL(/\/proyectos\/hp$/);
  await expect(page.getByRole('heading', { level: 1, name: 'HP: Health Points' })).toBeVisible();
  for (const seccion of [
    'El problema',
    'Mi papel',
    'Decisiones técnicas',
    'Arquitectura',
    'Resultado',
    'Qué aprendí',
  ]) {
    await expect(page.getByRole('heading', { level: 2, name: seccion })).toBeVisible();
  }
  await page.getByRole('link', { name: /Proyecto siguiente/ }).click();
  await expect(page).toHaveURL(/\/proyectos\/prestalab$/);
});

test('el formulario valida en línea y confirma el envío', async ({ page }) => {
  // Simulamos la función del servidor: aquí se prueba la interfaz, no Resend.
  await page.route('**/api/contacto', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) }),
  );
  await page.goto('/#contacto');
  const enviar = page.getByRole('button', { name: 'Enviar mensaje' });

  await enviar.click();
  await expect(page.getByText('Escribe tu nombre.')).toBeVisible();
  await expect(page.getByLabel('Nombre')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel('Nombre')).toBeFocused();

  await page.getByLabel('Nombre').fill('Ana');
  await page.getByLabel('Email').fill('ana@correo');
  await page.getByLabel('Mensaje').fill('Hola, tengo un proyecto para una app móvil.');
  await enviar.click();
  await expect(page.getByText('Escribe un email válido, por ejemplo nombre@correo.com.')).toBeVisible();

  await page.getByLabel('Email').fill('ana@correo.com');
  await enviar.click();
  await expect(page.getByRole('status').filter({ hasText: 'Mensaje enviado' })).toBeVisible();
  await expect(page.getByLabel('Nombre')).toHaveValue('');
});

test('la función de contacto valida en el servidor', async ({ request }) => {
  const res = await request.post('/api/contacto', {
    headers: { Accept: 'application/json' },
    multipart: { nombre: '', email: 'no-es-email', mensaje: 'corto', inicio: '1' },
  });
  expect(res.status()).toBe(422);
  const json = await res.json();
  expect(json.ok).toBe(false);
  expect(json.errores.email).toContain('email válido');
});

test('el tema Noche se aplica y se recuerda', async ({ page }) => {
  await page.goto('/');
  const noche = page.getByRole('button', { name: 'Noche' }).first();
  if (!(await noche.isVisible())) await page.getByRole('button', { name: 'Menú', exact: true }).click();
  await noche.click();
  await expect(page.locator('html')).toHaveAttribute('data-tema', 'noche');
  await expect(noche).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-tema', 'noche');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(14, 21, 36)');
});

test('el menú móvil atrapa el foco y se cierra con Escape', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Solo aplica en móvil');
  await page.goto('/');
  const boton = page.getByRole('button', { name: 'Menú', exact: true });
  await boton.click();
  await expect(boton).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('dialog', { name: 'Menú' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(boton).toHaveAttribute('aria-expanded', 'false');
  await expect(boton).toBeFocused();
});

test('el enlace para saltar al contenido es el primer foco', async ({ page, isMobile }) => {
  test.skip(!!isMobile, 'Teclado físico');
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Saltar al contenido' })).toBeFocused();
});

test('una dirección que no existe muestra la 404 con salidas', async ({ page }) => {
  const res = await page.goto('/esto-no-existe');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Fuera de lugar' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Ir al inicio' })).toBeVisible();
});

test('el CV tiene los datos y no incluye la cédula', async ({ page }) => {
  await page.goto('/cv');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Miguel Ángel Pantoja Guerra');
  await expect(page.getByRole('main').getByText('miguelpantojag03@gmail.com')).toBeVisible();
  await expect(page.locator('body')).not.toContainText(/c[ée]dula|\d{8,}/i);
});

test('la cancha muestra el proyecto de cada posición y el filtro resalta por tecnología', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Kalma.*Extremo derecho/ }).click();
  await expect(page.getByRole('button', { name: /Kalma.*Extremo derecho/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.locator('[data-jugada]')).toContainText('Diario de síntomas por voz');
  await expect(page.locator('[data-jugada] a')).toHaveAttribute('href', '/proyectos/kalma');

  await page.getByRole('button', { name: 'Supabase', exact: true }).click();
  await expect(page.getByText('2 proyectos usan Supabase.')).toBeVisible();
  await expect(page.locator('.proyecto.atenuado')).toHaveCount(2);
});

test('el marcador muestra datos reales y cada proyecto lleva su dorsal', async ({ page }) => {
  await page.goto('/');
  const marcador = page.locator('.marcador');
  await expect(marcador.getByRole('definition').first()).toHaveText('4');
  await expect(marcador).toContainText('2028');
  // Mismo dorsal en la cancha y en la tarjeta: PrestaLab es el 4.
  await expect(page.getByRole('button', { name: /PrestaLab/ })).toContainText('4');
  await expect(page.locator('[data-proyecto]').nth(1).locator('.proyecto__dorsal')).toHaveText('4');
});

test('fuera del código: el balón cuenta toques y la guitarra suena', async ({ page }) => {
  await page.goto('/#fuera-del-codigo');
  const seccion = page.getByRole('region', { name: 'Fuera del código' });
  await expect(seccion.getByRole('heading', { name: 'Fútbol' })).toBeVisible();
  await expect(seccion.getByRole('heading', { name: 'Dibujar' })).toBeVisible();
  await expect(seccion.getByRole('heading', { name: 'Guitarra' })).toBeVisible();

  const toque = seccion.getByRole('button', { name: 'Dar un toque' });
  await toque.click();
  await toque.click();
  await expect(seccion.locator('[data-cuenta]')).toHaveText('2');
  await expect(seccion.locator('[data-record]')).toHaveText('2');

  // Seis cuerdas, todas alcanzables con teclado; al tocar una se enciende.
  await expect(seccion.locator('[data-frecuencia]')).toHaveCount(6);
  await seccion.getByRole('button', { name: 'Sol' }).click();
  await expect(seccion.getByRole('button', { name: 'Sol' })).toHaveClass(/sonando/);
});
