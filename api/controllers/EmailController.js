var nodemailer = require("nodemailer");
var otplib = require('otplib');
var config = require('../../Config'), mongoose = require('mongoose'), familyMember = mongoose.model('FamilyMember'), otpAuthentication = mongoose.model('OTPAuthentication'), dateTime = require('node-datetime'), moment = require('moment'), member = mongoose.model('Member');
var http = require("http");
var qs = require("querystring");
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
    var OTP = '';
    member.findOne({ MobileNo: mobileNumber }, function (err, data) {
        if (err) {
            res.send('Internal server error');
        }
        else if (data) {
            result = data;
            if (result && result.IsActive) {
                var message = 'Your verification code is ##OTP##';
                var options = {
                    "method": "POST",
                    "hostname": "control.msg91.com",
                    "port": null,
                    "path": '/api/sendotp.php?authkey=245867AY8LDlZMEhx85bdbf435&message=' + encodeURIComponent(message) + '&sender=UGPSOT&mobile=' + mobileNumber,
                    "headers": {},
                };
                var req = http.request(options, function (result) {
                    var chunks = [];
                    result.on("data", function (chunk) {
                        chunks.push(chunk);
                    });
                    result.on("end", function () {
                        var validMemberData = Buffer.concat(chunks);
                        var responce = validMemberData.toString();
                        var obj = JSON.parse(responce);
                        if (obj.type == 'success') {
                            res.send(data);
                        }
                    });
                });
                req.end();
            }
            else {
                res.send('Inactive member');
            }
        }
        else if (!data) {
            familyMember.findOne({ Mobile: mobileNumber }, function (err, data) {
                if (err) {
                    res.send('Internal server error');
                }
                else if (!data)
                    res.send('Member mobile number not found');
                else {
                    result = data;
                    member.findOne({ MemberId: result.MemberId }, function (err, memberData) {
                        if (err) {
                            res.send('Internal server error');
                        }
                        if (result && memberData.IsActive) {
                            var message = 'Your verification code is ##OTP##';
                            var options = {
                                "method": "POST",
                                "hostname": "control.msg91.com",
                                "port": null,
                                "path": '/api/sendotp.php?authkey=245867AY8LDlZMEhx85bdbf435&message=' + encodeURIComponent(message) + '&sender=UGPSOT&mobile=' + mobileNumber,
                                "headers": {},
                            };
                            var req = http.request(options, function (result) {
                                var chunks = [];
                                result.on("data", function (chunk) {
                                    chunks.push(chunk);
                                });
                                result.on("end", function () {
                                    var validMemberData = Buffer.concat(chunks);
                                    var responce = validMemberData.toString();
                                    var obj = JSON.parse(responce);
                                    if (obj.type == 'success') {
                                        res.send(data);
                                    }
                                });
                            });
                            req.end();
                        }
                        else {
                            res.send('Inactive member');
                        }
                    });
                }
            });
        }
    });
};
exports.validateOTP = function (req, res) {
    var mobileNumber = req.params.MobileNumber;
    var otp = req.params.OTP;
    var ReferenceId = req.params.referenceId;
    var IsMember = req.params.isMember;
    var new_otp = new otpAuthentication();
    var ClientIp = '';
    var authenticationId = null;
    var dt = dateTime.create(moment());
    var formatted = dt.format('Y-m-d H:M:S');
    var options = {
        "method": "POST",
        "hostname": "control.msg91.com",
        "port": null,
        "path": "/api/verifyRequestOTP.php?authkey=245867AY8LDlZMEhx85bdbf435&mobile=" + mobileNumber + "&otp=" + otp,
        "headers": {
            "content-type": "application/x-www-form-urlencoded"
        }
    };
    var req1 = http.request(options, function (result) {
        var chunks = [];
        result.on("data", function (chunk) {
            chunks.push(chunk);
        });
        result.on("end", function () {
            var vaerifiedData = Buffer.concat(chunks);
            var responce = vaerifiedData.toString();
            var obj = JSON.parse(responce);
            if (obj.type == 'success') {
                new_otp.ReferenceId = ReferenceId;
                new_otp.IsMember = IsMember;
                new_otp.LoggedIn = formatted;
                new_otp.ClientIp = ClientIp;
                new_otp.OTP = otp;
                new_otp.save(function (err, data) {
                    if (err) {
                        res.status(500).send('Internal server error');
                    }
                    res.send(data);
                });
            }
            else {
                res.send('Invalid OTP');
            }
        });
    });
    req1.write(qs.stringify({}));
    req1.end();
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