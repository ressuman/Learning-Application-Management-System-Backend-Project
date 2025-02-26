const validateDiscounts = (discounts) => {
  if (discounts.registration < 0 || discounts.registration > 100) {
    throw new IndexError("Registration discount must be between 0-100%", 400);
  }

  discounts.courses.forEach((d) => {
    if (d.discount < 0 || d.discount > 100) {
      throw new IndexError("Course discounts must be between 0-100%", 400);
    }
  });

  return discounts;
};
