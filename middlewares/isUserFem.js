export default async function isUserFem(req, res, next) {
    try {
      if (req.currentUser.role === "USERNB") {
        return res.status(401).json({ msg: "Desculpa, essa seção é exclusiva para mulheres (ou seja, todas que se identificam com o gênero feminino)!" });
      }
  
      next();
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }