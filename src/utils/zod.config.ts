import * as z from "zod";

z.config({
  ...z.locales.pt(),
  customError: (iss) => {
    const last = iss.path?.[iss.path.length - 1];

    if (iss.code === "too_small") {
      return { message: "Este campo é obrigatório" };
    }

    if (last === "description") {
      const max = iss.maximum ?? 0;
      return { message: `Informe no máximo ${max} caracteres.` };
    }

    if (last === "birthday") {
      return { message: "Data inválida" };
    }
  },
});
