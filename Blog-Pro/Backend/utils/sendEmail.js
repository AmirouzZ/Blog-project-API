const nodemailer = require('nodemailer')

const sendEmail = async (userEmail, subject, htmlTemplate) => {
    try {
        //emailservice: gmail(free and popular)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.APP_EMAIL_ADDRESS, // sender
                pass: process.env.APP_EMAIL_PASSWORD
            },
        })

        const mailOptions = {
            from: process.env.APP_EMAIL_ADDRESS, // sender
            to: userEmail, // reciever
            subject: subject,
            html: htmlTemplate
        }

        const info = await transporter.sendMail(mailOptions)
        console.log("Email Sent: " + info.response)
    } catch (error) {
        console.log(error)
        throw new Error('Internal server error(nodemailer)')
    }
}


module.exports = sendEmail