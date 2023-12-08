const fs = require("fs");
const path = require("path");
const pdf = require("html-pdf");
const puppeteer = require("puppeteer");

// const PDFdocument = require("pdfkit");

// const pathToPDF = path.join(process.cwd(), "test.pdf");
// let doc = new PDFdocument({ margin: 50 });
// doc.fontSize(10).text("Tran Xuan Thang", 200, 400, { align: "center" });
// doc.end();
// doc.pipe(fs.createWriteStream(pathToPDF));

// const htmlContent = fs.readFileSync("test.html", "utf-8");
// const options = { format: "Letter" };
// pdf.create(htmlContent, options).toFile('./test.pdf', (err, res) => {
//     if (err) return console.log(err);
//     console.log(res);
// })

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  const htmlContent = fs.readFileSync("test.html", "utf-8");
  await page.setContent(htmlContent);

  await page.pdf({
    path: "test.pdf",
    format: "A4",
    margin: { top: "2cm", right: "2cm", bottom: "2cm", left: "2cm" },
  });
  await browser.close();
})();
