import { PASSWORD_REGEX } from "./password";

describe("Password Regex", () => {
  it("should reject empty password", () => {
    const password = "";
    expect(PASSWORD_REGEX.test(password)).toBe(false);
  });

  it("should reject password with only spaces", () => {
    const password = "     ";
    expect(PASSWORD_REGEX.test(password)).toBe(false);
  });

  it("should reject password with spaces", () => {
    const password = " Lorem 12 ";
    expect(PASSWORD_REGEX.test(password)).toBe(false);
  });

  it("should reject password with only letters", () => {
    const password = "Lorem";
    expect(PASSWORD_REGEX.test(password)).toBe(false);
  });

  it("should reject password with only numbers", () => {
    const password = "27648762";
    expect(PASSWORD_REGEX.test(password)).toBe(false);
  });

  it("should reject alphanumeric password", () => {
    const password = "2Lorem12";
    expect(PASSWORD_REGEX.test(password)).toBe(false);
  });

  it("should reject password with only special characters", () => {
    const password = '!"#$%&/()=?¡¨*+´{ñ_:Ñ[;:<>?/~`-';
    expect(PASSWORD_REGEX.test(password)).toBe(false);
  });

  it("should accept alphanumeric password with special characters", () => {
    const password = '@!"#Lorem"$$%%12&&%(/%&)((=))(/';
    expect(PASSWORD_REGEX.test(password)).toBe(true);
  });
});
