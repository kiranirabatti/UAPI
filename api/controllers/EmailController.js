var nodemailer = require("nodemailer");
var otplib = require('otplib');
var config = require('../../Config'), mongoose = require('mongoose'), familyMember = mongoose.model('FamilyMember'), otpAuthentication = mongoose.model('OTPAuthentication'), dateTime = require('node-datetime'), moment = require('moment'), member = mongoose.model('Member');
exports.sendEmail = function (req, res) {
    var email = req.params.EmailAddress;
    var new_otp = new otpAuthentication();
    familyMember.findOne({ Email: email, LookingForPartner: 'Yes' }, function (err, data) {
        if (err)
            res.status(500).send('Internal server error');
        else if (!data)
            res.send('User not found');
        else {
            var token_1 = otplib.authenticator.generate(config.secret);
            var smtpTransport = nodemailer.createTransport({
                service: "gmail",
                host: "smtp.gmail.com",
                port: 587,
                auth: {
                    user: "scriptshubtechnologies@gmail.com",
                    pass: "ScriptsHub@4321"
                }
            });
            var mailOptions = {
                to: email,
                subject: "UGPS OTP for Login",
                html: '<strong>Your one time password is: ' + token_1 + '</strong>'
            };
            smtpTransport.sendMail(mailOptions, function (error, response) {
                if (error) {
                    res.status(500).send('Internal server error');
                }
                else if (response) {
                    var dt = dateTime.create(moment());
                    var formatted = dt.format('Y-m-d H:M:S');
                    new_otp.EmailAddress = email;
                    new_otp.CreatedTime = formatted;
                    new_otp.ExpiredTime = moment(formatted).add(10, 'minutes');
                    new_otp.OTP = token_1;
                    new_otp.save(function (err, data) {
                        if (err)
                            res.status(500).send('Internal server error');
                        res.send(data);
                    });
                }
                else {
                    res.send('');
                }
            });
        }
    });
};
exports.validateEmail = function (req, res) {
    var email = req.params.EmailAddress;
    var otp = req.params.OTP;
    otpAuthentication.find({
        EmailAddress: email
    }, ['type', 'CreatedTime', 'OTP', 'EmailAddress', 'ExpiredTime'], {
        skip: 0,
        limit: 1,
        sort: {
            CreatedTime: -1
        }
    }, function (err, data) {
        if (err)
            res.status(500).send('Internal server error');
        else if (data) {
            var dt = dateTime.create(moment());
            var formatted = dt.format('Y-m-d H:M:S');
            var result = data[0].ExpiredTime.getTime() - dt.getTime();
            var final = result / 60000;
            if (final < 0 || final > 10) {
                res.send('OTP is not valid');
            }
            else {
                if (data[0].OTP == otp)
                    res.send(data);
                else
                    res.send('OTP is not valid');
            }
        }
        else
            res.send('Email is not found');
    });
};
exports.sendSmsToMember = function (req, res) {
    var mobileNumber = req.params.MobileNumber;
    var result;
    var new_otp = new otpAuthentication();
    var IsMember = false;
    var ClientIp = '';
    member.findOne({ MobileNo: mobileNumber }, function (err, data) {
        if (err) {
            res.send('Internal server error');
        }
        else if (data) {
            result = data;
            if (result) {
                IsMember = true;
                ClientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                var dt = dateTime.create(moment());
                var formatted = dt.format('Y-m-d H:M:S');
                new_otp.ReferenceId = result.MemberId;
                new_otp.IsMember = IsMember;
                new_otp.LoggedIn = formatted;
                new_otp.ClientIp = ClientIp;
                new_otp.save(function (err, data) {
                    if (err) {
                        res.status(500).send('Internal server error');
                    }
                    res.send(result);
                });
            }
        }
        else if (!data) {
            familyMember.findOne({ Mobile: mobileNumber }, function (err, data) {
                if (err) {
                    res.send('Internal server error');
                }
                else if (!data)
                    res.send('family member Mobile number not found');
                else {
                    result = data;
                    if (result) {
                        IsMember = false;
                        ClientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                        var dt = dateTime.create(moment());
                        var formatted = dt.format('Y-m-d H:M:S');
                        new_otp.ReferenceId = result.FamilyMemberId;
                        new_otp.IsMember = IsMember;
                        new_otp.LoggedIn = formatted;
                        new_otp.ClientIp = ClientIp;
                        new_otp.save(function (err, data) {
                            if (err) {
                                res.status(500).send('Internal server error');
                            }
                            res.send(result);
                        });
                    }
                }
            });
        }
    });
};
exports.sendEmailToMember = function (req, res) {
    var email = req.params.EmailAddress;
    var new_otp = new otpAuthentication();
    var result;
    member.findOne({ Email: email }, function (err, data) {
        if (err) {
            res.status(500).send('Internal server error');
        }
        else if (!data)
            res.send('Email not found');
        else {
            result = data;
            var otp_1 = otplib.authenticator.generate(config.secret);
            var smtpTransport = nodemailer.createTransport({
                service: "gmail",
                host: "smtp.gmail.com",
                port: 587,
                auth: {
                    user: "scriptshubtechnologies@gmail.com",
                    pass: "ScriptsHub@4321"
                }
            });
            var mailOptions = {
                to: email,
                subject: "UGPS OTP for member Login",
                html: '<strong>Your one time password is: ' + otp_1 + '</strong>'
            };
            smtpTransport.sendMail(mailOptions, function (error, response) {
                if (error) {
                    res.status(500).send('Error while sending email' + error);
                }
                else if (response) {
                    var dt = dateTime.create(moment());
                    var formatted = dt.format('Y-m-d H:M:S');
                    new_otp.EmailAddress = email;
                    new_otp.CreatedTime = formatted;
                    new_otp.ExpiredTime = moment(formatted).add(10, 'minutes');
                    new_otp.OTP = otp_1;
                    new_otp.save(function (err, data) {
                        if (err) {
                            res.status(500).send('Internal server error');
                        }
                        res.send(result);
                    });
                }
                else
                    res.send('Email not found');
            });
        }
    });
};
//# sourceMappingURL=EmailController.js.map