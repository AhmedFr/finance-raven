import { useId, useState } from "react";
import type { NumberFieldProps } from "./NumberField.types";
import { Field } from "../../../components/Field";
import { toNullableNumber } from "../../../lib/numbers";

/** Remount with `key={value}` from the parent to pick up external changes (import, reset). */
export function NumberField({ label, value, onCommit, min = 0, hint }: NumberFieldProps) {
  const id = useId();
  const [raw, setRaw] = useState(String(value));
  const commit = () => {
    const parsed = toNullableNumber(raw);
    if (parsed == null || parsed < min) { setRaw(String(value)); return; }
    setRaw(String(parsed));
    if (parsed !== value) onCommit(parsed);
  };
  return (
    <Field label={label} htmlFor={id} hint={hint}>
      <input
        id={id} inputMode="decimal" value={raw}
        onChange={(e) => setRaw(e.target.value)} onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
      />
    </Field>
  );
}
