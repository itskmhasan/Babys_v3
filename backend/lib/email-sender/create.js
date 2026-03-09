const PDFDocument = require("pdfkit");
const fetch = require("node-fetch");

const isPrivateOrLocalHost = (hostname) => {
  const host = String(hostname || "").toLowerCase();

  if (!host) return true;
  if (host === "localhost" || host === "::1") return true;
  if (host.endsWith(".local")) return true;

  if (host.startsWith("127.")) return true;
  if (host.startsWith("10.")) return true;
  if (host.startsWith("192.168.")) return true;
  if (host.startsWith("169.254.")) return true;
  if (host.startsWith("fc") || host.startsWith("fd") || host.startsWith("fe80:")) return true;

  if (host.startsWith("172.")) {
    const secondOctet = Number(host.split(".")[1]);
    if (secondOctet >= 16 && secondOctet <= 31) {
      return true;
    }
  }

  return false;
};

const isSafeRemoteUrl = (rawUrl) => {
  try {
    const parsed = new URL(String(rawUrl || ""));
    const isHttp = parsed.protocol === "http:" || parsed.protocol === "https:";
    if (!isHttp) return false;

    return !isPrivateOrLocalHost(parsed.hostname);
  } catch (error) {
    return false;
  }
};

const handleCreateInvoice = async (invoice, path) => {
  const pdfBuffer = await new Promise((resolve) => {
    let doc = new PDFDocument({ size: "A4", margin: 50 });
    const hasRemoteLogo =
      typeof invoice?.company_info?.logo === "string" &&
      invoice.company_info.logo.trim() !== "";

    // doc.text('hello world', 100, 50);
    // doc.end();
    if (hasRemoteLogo) {
      getImage(doc, invoice)
        .then((logoBuffer) => {
          generateHeader(doc, invoice, logoBuffer);
          generateCustomerInformation(doc, invoice);
          generateInvoiceTable(doc, invoice);
          doc.end();
        })
        .catch(() => {
          generateHeader(doc, invoice, null);
          generateCustomerInformation(doc, invoice);
          generateInvoiceTable(doc, invoice);
          doc.end();
        });
    } else {
      generateHeader(doc, invoice, null);
      generateCustomerInformation(doc, invoice);
      generateInvoiceTable(doc, invoice);
      doc.end();
    }
    // generateFooter(doc);

    // console.log('doc', doc);

    // doc.pipe(fs.createWriteStream(`invoices/${invoice.invoice}.pdf`));

    //Finalize document and convert to buffer array
    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      let pdfData = new Uint8Array(Buffer.concat(buffers));
      resolve(pdfData);
    });
  });

  // fs.writeFile(pdfBuffer, 'test', function (err) {
  //   if (err) {
  //     return console.log('err when saving file', err);
  //   }
  //   console.log('The file was saved!');
  // });

  return pdfBuffer;
};

const getImage = async (doc, invoice) => {
  const logoUrl = invoice?.company_info?.logo;

  if (!isSafeRemoteUrl(logoUrl)) {
    throw new Error("Unsafe logo URL");
  }

  const res = await fetch(logoUrl, { encoding: null });
  const imageBuffer = await res.buffer();
  const img = Buffer.from(imageBuffer);
  return img;
};

const generateHeader = (doc, invoice, logoSource) => {
  // const logo = getImage(doc, invoice);
  // console.log('logooooo>>>', logo);

  doc
    .fontSize(17)
    .font("Helvetica-Bold")
    .text("Invoice", 50, 50)
    .fontSize(10)
    .font("Helvetica")
    .text("Status :", 50, 70)
    .text(invoice.status, 100, 70)
    .fontSize(10)
    .font("Helvetica")
    .text("VAT Number :", 50, 85)
    .text(invoice?.company_info?.vat_number, 120, 85)

    // .fillColor('#4C4F54')
    .fontSize(12)
    .font("Helvetica-Bold")
    .text(invoice?.company_info?.company, 200, 50, { align: "right" })
    .fontSize(10)
    .font("Helvetica")
    .text(invoice?.company_info?.address, 200, 65, { align: "right" })
    .text(invoice?.company_info?.phone, 200, 80, { align: "right" })
    .text(invoice?.company_info?.email, 200, 95, { align: "right" })
    .text(invoice?.company_info?.website, 200, 108, { align: "right" })
    .moveDown();

  if (logoSource) {
    doc.image(logoSource, doc.page.width - 90, 50, {
      width: 40,
    });
  }
};

function generateCustomerInformation(doc, invoice) {
  // doc.fillColor('#444444').fontSize(20).text('Invoice', 50, 130);

  const customerInformationTop = 140;
  doc.font("Helvetica-Bold");

  generateTableRow(doc, customerInformationTop, "Date", "Invoice", "Method");
  const customerInformationTopDetail = customerInformationTop + 20;
  doc.font("Helvetica");
  doc.fontSize(10);
  generateTableRow(
    doc,
    customerInformationTopDetail,
    invoice?.date,
    "#" + invoice.invoice,
    invoice?.paymentMethod
  );

  doc

    .font("Helvetica-Bold")
    .text("Invoice To", 200, 140, { align: "right" })
    .font("Helvetica")
    .fontSize(10)
    .text(invoice.user_info.name, 200, 155, { align: "right" })
    .text(invoice.user_info.email, 200, 170, { align: "right" })
    .text(invoice?.user_info?.phone, 200, 200, { align: "right" })
    .text(invoice?.user_info?.address, 200, 185, { align: "right" });

  // doc
  //   .fontSize(10)
  //   .text('Invoice Number:', 50, customerInformationTop)
  //   .font('Helvetica-Bold')
  //   .text(invoice.invoice, 150, customerInformationTop)
  //   .font('Helvetica')
  //   .text('Invoice Date:', 50, customerInformationTop + 15)
  //   .text(invoice.date, 150, customerInformationTop + 15)
  //   .text('Payment Method:', 50, customerInformationTop + 30)
  //   .font('Helvetica-Bold')
  //   .text(invoice.paymentMethod, 150, customerInformationTop + 30)

  //   .font('Helvetica-Bold')
  //   .text(invoice.user_info.name, 300, customerInformationTop)
  //   .font('Helvetica')
  //   .text(invoice.user_info.email, 300, customerInformationTop + 15)

  // .moveDown();
}

function generateInvoiceTable(doc, invoice) {
  let i;
  const invoiceTableTop = 250;

  doc.font("Helvetica-Bold");

  generateTableRow(
    doc,
    invoiceTableTop,
    "Name",
    "",
    "Quantity",
    "Item Price",
    "Total Price"
  );
  generateHr(doc, invoiceTableTop + 18);
  doc.font("Helvetica");

  for (i = 0; i < invoice.cart.length; i++) {
    const item = invoice.cart[i];
    const position = invoiceTableTop + (i + 1) * 30;
    const total = item.price * item.quantity;
    generateTableRow(
      doc,
      position,
      item.title.substring(0, 25),
      "",
      item.quantity,
      formatCurrency(invoice.company_info.currency, item.price),
      formatCurrency(invoice.company_info.currency, total)
    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 31;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    subtotalPosition,
    "SubTotal",
    "VAT",
    "Shipping Cost",
    "Discount",
    "Total"
  );
  const paymentOptionPosition = subtotalPosition + 20;
  generateTableRow(
    doc,
    paymentOptionPosition,

    formatCurrency(invoice.company_info.currency, invoice.subTotal),
    formatCurrency(invoice.company_info.currency, invoice.vat),
    formatCurrency(invoice.company_info.currency, invoice.shippingCost),
    formatCurrency(invoice.company_info.currency, invoice.discount),
    formatCurrency(invoice.company_info.currency, invoice.total)
  );

  // const vatPosition = subtotalPosition + 20;
  // generateTableRow(
  //   doc,
  //   vatPosition,
  //   '',
  //   '',
  //   'VAT',
  //   '',
  //   formatCurrency(invoice.company_info.currency, invoice.vat)
  // );
  // const shippingPosition = vatPosition + 20;
  // generateTableRow(
  //   doc,
  //   shippingPosition,
  //   '',
  //   '',
  //   'Shipping Cost',
  //   '',
  //   formatCurrency(invoice.company_info.currency, invoice.shippingCost)
  // );
  // const discountPosition = shippingPosition + 20;
  // generateTableRow(
  //   doc,
  //   discountPosition,
  //   '',
  //   '',
  //   'Discount',
  //   '',
  //   formatCurrency(invoice.company_info.currency, invoice.discount)
  // );

  // doc
  //   .strokeColor('#aaaaaa')
  //   .lineWidth(1)
  //   .moveTo(250, discountPosition + 20)
  //   .lineTo(550, discountPosition + 20)
  //   .stroke();

  // const TotalPosition = discountPosition + 25;
  // doc.font('Helvetica-Bold');
  // generateTableRow(
  //   doc,
  //   TotalPosition,
  //   '',
  //   '',
  //   'Total',
  //   '',
  //   formatCurrency(invoice.company_info.currency, invoice.total)
  // );
  // doc.font('Helvetica');
}

function generateFooter(doc) {
  doc
    .fontSize(15)
    .text("Thanks for your order", 50, 750, { align: "center", width: 500 });
}

function generateTableRow(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal
) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 150, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatCurrency(curr, cents) {
  const printableCurrency = normalizeCurrency(curr);
  return `${printableCurrency}${Number(cents || 0).toFixed(2)}`;
}

function normalizeCurrency(curr) {
  const raw = String(curr || "").trim();

  if (!raw) {
    return "$";
  }

  // PDF built-in fonts can corrupt some unicode symbols (e.g., Bangla Taka sign),
  // so map known symbols to ASCII-safe text.
  if (raw === "৳") {
    return "BDT ";
  }

  return raw;
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;
}

module.exports = {
  handleCreateInvoice,
};
