🧱 1. Nueva columna
ALTER TABLE cotizaciones
ADD COLUMN fecha_actualizacion TIMESTAMP NULL;

-------------------------------------------------------------------

⚡ 2. Función del trigger
CREATE OR REPLACE FUNCTION set_fecha_actualizacion_cotizacion()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.id_estado = 2 AND OLD.id_estado IS DISTINCT FROM 2 THEN
    NEW.fecha_actualizacion := NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-------------------------------------------------------------------

🔗 3. Trigger
DROP TRIGGER IF EXISTS trg_set_fecha_actualizacion ON cotizaciones;

CREATE TRIGGER trg_set_fecha_actualizacion
BEFORE UPDATE ON cotizaciones
FOR EACH ROW
EXECUTE FUNCTION set_fecha_actualizacion_cotizacion();

-------------------------------------------------------------------

⏰ 4. Lógica de vencimiento (query base)
UPDATE cotizaciones
SET id_estado = 5
WHERE id_estado = 2
  AND fecha_actualizacion IS NOT NULL
  AND fecha_actualizacion + INTERVAL '7 days' <= NOW();
  
-------------------------------------------------------------------

🧪 5. Query de validación (muy útil)
SELECT id,
       id_estado,
       fecha_actualizacion,
       fecha_actualizacion + INTERVAL '7 days' AS fecha_vencimiento,
       NOW() AS ahora
FROM cotizaciones
WHERE id_estado = 2;

-------------------------------------------------------------------

🔍 6. Query para ver vencidas sin actualizar
SELECT *
FROM cotizaciones
WHERE id_estado = 2
  AND fecha_actualizacion + INTERVAL '7 days' <= NOW();

-------------------------------------------------------------------

⚡ 7. (Opcional PRO) Índice para performance
CREATE INDEX idx_cotizaciones_vencimiento
ON cotizaciones (fecha_actualizacion)
WHERE id_estado = 2;

-------------------------------------------------------------------
-- "0 2 * * *"

-- 👉 Significa:

-- Campo	Valor
-- minuto	0
-- hora	2
-- día	*
-- mes	*
-- día semana	*

