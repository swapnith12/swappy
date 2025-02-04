import nodemailer from 'nodemailer'

export async function sendmail ({email , emailType , userId}:any){
  try {

    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, 
        auth: {
          user: "maddison53@ethereal.email",
          pass: "jn7jnAPss4f63QBp6D",
        },
      });      
      const mail = await transporter.sendMail({
        from: 'foo@gmail.com', 
        to: "bar@example.com, baz@example.com", 
        subject: emailType==="Verification"?"Please verify your mail":
        "Reset password", 
        html: "<b>Hello world?</b>",
      });
  } catch (error:any) {
    throw new Error(error.message)
  }
}