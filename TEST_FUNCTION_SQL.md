# Test de la fonction generate_vehicle_code

## Teste si la fonction existe

```sql
-- 1. Vérifier si la fonction existe
SELECT proname FROM pg_proc WHERE proname = 'generate_vehicle_code';
```

**Résultat attendu** : 1 ligne avec `generate_vehicle_code`

---

## 2. Tester la fonction

```sql
SELECT generate_vehicle_code() as code_test;
```

**Résultat attendu** : Un code à 6 chiffres comme `123456`

---

## 3. Si ça ne fonctionne pas, recrée la fonction

```sql
CREATE OR REPLACE FUNCTION generate_vehicle_code()
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    new_code := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    SELECT EXISTS(SELECT 1 FROM vehicles WHERE code_confirmation = new_code) INTO code_exists;
    EXIT WHEN NOT code_exists;
  END LOOP;
  RETURN new_code;
END;
$$ LANGUAGE plpgsql;
```

Puis reteste :

```sql
SELECT generate_vehicle_code();
```

---

Dis-moi ce que tu obtiens !



