const fs = require("fs");
const puppeteer = require("puppeteer");
const path = require("path");

module.exports = {
  generatePdfContract: async (content) => {
    try {
      const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    const pathToTemplate = path.join(__dirname, "contract-template.html");
    const htmlContent = fs.readFileSync(pathToTemplate, "utf-8");

    

    await page.setContent(htmlContent);
    await page.evaluate((content) => {
      document.getElementById("tutor-name").textContent = content.tutor.name;
      document.getElementById("tutor-phone").textContent = content.tutor.phone;
      document.getElementById("tutor-birth").textContent = content.tutor.birth;
      document.getElementById("tutor-address").textContent = content.tutor.address;
      document.getElementById("tutor-job").textContent = content.tutor.job;

      document.getElementById("parent-name").textContent = content.parent.name;
      document.getElementById("parent-phone").textContent = content.parent.phone;
      document.getElementById("parent-address").textContent = content.parent.address;

      document.getElementById("class-subject").textContent = content.classInfo.subject;
      document.getElementById("class-schedule").textContent = content.classInfo.schedule;
      document.getElementById("class-price").textContent = content.classInfo.price;
      document.getElementById("class-time-per-day").textContent = content.classInfo.time_per_day;
    }, content);
    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: { top: "2cm", right: "2cm", bottom: "2cm", left: "2cm" },
    });

    await browser.close();

    return pdfBuffer;
    } catch (err) {
      err.statusCode = 500;
      err.errors = ["Failed to generate pdf contract"];
      throw err;
    }
  },
};
