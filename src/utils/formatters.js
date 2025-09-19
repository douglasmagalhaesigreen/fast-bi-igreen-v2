export const formatters = {
  currency: (value, locale = 'pt-BR', currency = 'BRL') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(value);
  },

  number: (value, locale = 'pt-BR') => {
    return new Intl.NumberFormat(locale).format(value);
  },

  percentage: (value, decimals = 1) => {
    return `${Number(value).toFixed(decimals)}%`;
  },

  energy: (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M kWh`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k kWh`;
    }
    return `${value} kWh`;
  }
};
