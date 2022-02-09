module.exports = () => {
  const resetPasswordToken = Math.floor(Math.random() * 1000000);
  const resetPasswordExpire =
    Date.now() + +process.env.RESET_TOKEN_EXPIRE * 60 * 1000;

  return { resetPasswordToken, resetPasswordExpire };
};
