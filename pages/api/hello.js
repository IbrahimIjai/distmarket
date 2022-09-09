// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function (req, res) {
  // res..json({ name: 'John Doe' })
  res.status(200).json({ status: "ok" });
}
