var mongoose = require('mongoose'),
    eventManagement = mongoose.model('EventManagement'),
    eventPhoto = mongoose.model('EventPhotos'),
    advertisement = mongoose.model('Advertisement'),
    member = mongoose.model('Member'),
    familyMember = mongoose.model('FamilyMember'),
    Committee = mongoose.model('CommitteeMember'),
    city = mongoose.model('City'),
    citizenship = mongoose.model('Citizenship'),
    education = mongoose.model('Education'),
    height = mongoose.model('Height'),
    native = mongoose.model('Native'),
    advertisementPhoto = mongoose.model('AdvertisementPhotos'),
    advertisementType = mongoose.model('AdvertisementType'),
    advertisementLocation = mongoose.model('AdvertisementLocation'),
    bannerManagement = mongoose.model('BannerManagement'),
    bannerPhoto = mongoose.model('BannerPhoto'),
    path = require('path'),
    otpAuthentication = mongoose.model('OTPAuthentication'),
    fs = require('fs'),
    config = require('../../Config');
const randomNum = require("crypto");
var moment = require('moment');


exports.joinEventModelWithPhotos = function (req, res) {
    eventManagement.aggregate([
        {
            $lookup:
            {
                from: 'EventPhotos',
                localField: 'EventId',
                foreignField: 'EventId',
                as: 'EventWithPhoto'
            }
        },
        {
            $project: {
                date: {
                    $dateFromString: {
                        dateString: '$EventDate'
                    }
                },
                EventDescription: '$EventDescription',
                EventDate:'$EventDate',
                EventVenue: '$EventVenue',
                IsPublished: '$IsPublished',
                EventName: '$EventName',
                IsActive: '$IsActive',
                EventId: '$EventId',
                EventWithPhoto: '$EventWithPhoto',
            }
        },
        {
            $sort: { date: 1 }
        }
    ]).exec(function (err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
}

exports.getEventPhotos = function (req, res) {
    var fileLocation = './Photos/Event/' + req.params.EventId + '/' + req.params.FileName;
    if (fs.existsSync(fileLocation)) {
        res.sendFile(path.resolve(fileLocation));
    }
}

exports.getAdvertisementPhoto = function (req, res) {
    var fileLocation = './Photos/Advertisement/' + req.params.AdvertisementId + '/' + req.params.FileName;
    if (fs.existsSync(fileLocation)) {
        res.sendFile(path.resolve(fileLocation));
    }
}

exports.getAllAdvertisements = function (req, res) {
    advertisement.aggregate([
        {
            $lookup:
            {
                from: 'AdvertisementPhotos',
                localField: 'AdvertisementId',
                foreignField: 'AdvertisementId',
                as: 'photos'
            }
        },
        {
            $lookup:
            {
                from: 'AdvertisementType',
                localField: 'AdvertisementType',
                foreignField: 'AdvertisementTypeId',
                as: 'typeData'
            },
        },
        {
            $lookup:
            {
                from: 'AdvertisementLocation',
                localField: 'AdvertisementLocation',
                foreignField: 'AdvertisementLocationId',
                as: 'locationData'
            },
        },
        {
            $unwind: { path: "$typeData" }
        },
        {
            $unwind: { path: "$locationData" }
        }
    ]).exec(function (err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
};

exports.getAllFamilyMembers = function (req, res) {
    familyMember.find({}, function (err, member) {
        if (err)
            res.send(err);
        res.json(member);
    });
};

exports.getAllMembers = function (req, res) {
    member.aggregate([
        { $project: { 'MemberId': 1, 'FullName': 1, 'FatherName': 1, 'GrandFatherName': 1, 'Gol': 1, 'MulVatan': 1, 'IsActive': 1, 'FileNameInFolder': 1,'FileName':1 } },
    ]).exec(function (err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
};

exports.searchMember = function (req, res) {
    var fieldName = req.params.fieldname;
    var regex = new RegExp(req.params.searchvalue, 'i');
    var query = {};
    query[fieldName] = regex;
    member.aggregate([
        {
            $match: query
        },
        { $project: { 'MemberId': 1, 'FullName': 1, 'FatherName': 1, 'GrandFatherName': 1, 'Gol': 1, 'MulVatan': 1, 'IsActive': 1, 'FileNameInFolder': 1,'FileName':1 } },
    ]).exec(function (err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
};

exports.getMemberbyId = function (req, res) {
    member.find({ MemberId: req.params.MemberId }, function (err, member) {
        if (err)
            res.send(err);
        res.json(member);
    });
};

exports.updateMemberProfile = function (req, res) {
    var date = new Date,
        GUID = randomNum.randomBytes(16).toString("hex"),
        extension = req.body.FileName.slice((req.body.FileName.lastIndexOf(".") - 1 >>> 0) + 2),
        flag = false;
    if (req.body.Image.startsWith(config.nodeURL + '/getDefaultMemberImage')) {
        flag = true;
    }
    req.body.UpdatedOn = date;

    if (!flag) {
        req.body.FileNameInFolder = GUID + '.' + extension;
    }
    else {
        req.body.FileNameInFolder = req.body.OldFileName
    }
    member.findOneAndUpdate({ MemberId: req.params.MemberId }, { 'FullName': req.body.FullName, 'MobileNo': req.body.MobileNo, 'Email': req.body.email, 'Address': req.body.Address, 'OldFileName': req.body.OldFileName, 'Image': req.body.Image, 'FileNameInFolder': req.body.FileNameInFolder, 'FileName': req.body.FileName }, { new: true }, function (err, member) {
        if (err)
            res.send(err);
        res.json(member);
        if (req.body.Image) {
            if (!flag) {
                var memberDir = ('./Photos/Members');
                if (!fs.existsSync(memberDir)) {
                    fs.mkdirSync(memberDir);
                }
                var dir = (memberDir + '/' + req.params.MemberId);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
                var FilePath = dir + '/' + req.body.OldFileName;
                if (fs.existsSync(FilePath) && req.body.OldFileName) {
                    fs.unlinkSync(FilePath);
                }
                var base64Data = req.body.Image.replace(/^data:image\/\w+;base64,/, "");
                fs.writeFile((dir + "/" + GUID + '.' + extension), base64Data, 'base64', function (err) {
                    console.log(err);
                });
            }
        }
    });
};

exports.getDefaultMemberImage = function (req, res) {
    res.sendFile(path.resolve('./Photos/profile-picture.png'));
};

exports.getFamilyMemberbyMemberId = function (req, res) {
    familyMember.find({ MemberId: req.params.MemberId }, function (err, member) {
        if (err)
            res.send(err);
        res.json(member);
    });
};

exports.getFamilyMemberbyId = function (req, res) {
    familyMember.find({ FamilyMemberId: req.params.familyMemberId }, function (err, familyMember) {
        if (err)
            res.send(err);
        res.json(familyMember);
    });
};

exports.getFamilyMemberImage = function (req, res) {
    var FileLocation = './Photos/FamilyMembers/' + req.params.memberId + '/' + req.params.fMemberId + '/' + req.params.fileName;
    if (fs.existsSync(FileLocation)) {
        res.sendFile(path.resolve(FileLocation));
    }
    else {
        res.sendFile(path.resolve('./Photos/profile-picture.png'));
    }
};

exports.updateFamilyMemberProfile = function (req, res) {
    var date = new Date,
        GUID = randomNum.randomBytes(16).toString("hex"),
        extension = req.body.Filename.slice((req.body.Filename.lastIndexOf(".") - 1 >>> 0) + 2),
        flag = false;
    if (req.body.Image.startsWith(config.nodeURL + '/getDefaultMemberImage')) {
        flag = true;
    }
    req.body.UpdatedOn = date;

    if (!flag) {
        req.body.FileNameInFolder = GUID + '.' + extension;
    }
    else {
        req.body.FileNameInFolder = req.body.OldFileName
    }
    familyMember.findOneAndUpdate({ FamilyMemberId: req.params.familyMemberId }, req.body, { new: true }, function (err, member) {
        if (err)
            res.send(err);
        res.json(member);
        if (req.body.Image) {
            if (!flag) {
                var familyMemberDir = ('./Photos/FamilyMembers');
                if (!fs.existsSync(familyMemberDir)) {
                    fs.mkdirSync(familyMemberDir);
                }
                var dir = (familyMemberDir + '/' + req.body.MemberId);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
                var newDir = (dir + '/' + req.body.FamilyMemberId);
                if (!fs.existsSync(newDir)) {
                    fs.mkdirSync(newDir);
                }
                var FilePath = newDir + '/' + req.body.OldFileName;
                if (fs.existsSync(FilePath) && req.body.OldFileName) {
                    fs.unlinkSync(FilePath);
                }
                var base64Data = req.body.Image.replace(/^data:image\/\w+;base64,/, "");
                fs.writeFile((newDir + "/" + GUID + '.' + extension), base64Data, 'base64', function (err) {
                    console.log(err);
                });
            }
        }
    });
};

exports.getStaticImage = function (req, res) {
    res.sendFile(path.resolve('./Photos/profile-picture.png'));
};

exports.sendMemberPhoto = function (req, res) {
    var fileLocation = './Photos/Members/' + req.params.MemberId + '/' + req.params.fileName;
    if (fs.existsSync(fileLocation)) {
        res.sendFile(path.resolve(fileLocation));
    }
    else {
        res.sendFile(path.resolve('./Photos/profile-picture.png'));
    }
};

exports.getAllCities = function (req, res) {
    city.find({}, function (err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
};

exports.getAllCitizens = function (req, res) {
    citizenship.find({}, function (err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
};

exports.getAllEducations = function (req, res) {
    education.find({}, function (err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
};

exports.getAllHeights = function (req, res) {
    height.find({}, function (err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
};

exports.getAllNativePlaces = function (req, res) {
    native.find({}, function (err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
};

exports.getAllMatrimonialMembers = function (req, res) {
    familyMember.aggregate([
        { $match: { "LookingForPartner": "Yes", "MaritalStatus": { "$ne": "married" || "Married" } } },
        {
            $lookup:
            {
                from: 'Height',
                localField: 'PartnerHeight',
                foreignField: 'HeightId',
                as: 'HeightData'
            }
        },
        {
            $lookup:
            {
                from: 'City',
                localField: 'City',
                foreignField: 'CityId',
                as: 'CityData'
            },
        },
        {
            $lookup:
            {
                from: 'Citizenship',
                localField: 'Citizenship',
                foreignField: 'CitizenshipId',
                as: 'CitizenshipData'
            },
        },
        {
            $lookup:
            {
                from: 'Native',
                localField: 'Native',
                foreignField: 'NativeId',
                as: 'NativeData'
            },
        },
        {
            $lookup:
            {
                from: 'Education',
                localField: 'Education',
                foreignField: 'EducationId',
                as: 'EducationData'
            },
        },
        {
            $project: {
                MemberId: '$MemberId',
                FamilyMemberId: '$FamilyMemberId',
                Name: '$Name',
                HeightData: '$HeightData',
                Age: '$Age',
                Gender: '$Gender',
                CityData: '$CityData',
                NativeData: '$NativeData',
                EducationData:'$EducationData',
                CitizenshipData: '$CitizenshipData',
                FileNameInFolder: '$FileNameInFolder',
                LookingForPartner: '$LookingForPartner',
                MaritalStatus: '$MaritalStatus'
            }
        }
    ]).exec(function (err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
}

exports.getMatrimonialResult = function (req, res) {
    var manglik = req.params.manglik;
    var handicap = (req.params.handicap == 'true');
    var fromAge = req.params.fromAge;
    var toAge = req.params.toAge;
    var gender = new RegExp("^" + req.params.gender + "$", "i");
    var martial = req.params.martial;
    var city = req.params.city;
    var education = req.params.education;
    var citizenShip = req.params.citizenShip;
    var native = req.params.native;
    var height = req.params.height;
    var myMatch = {
        LookingForPartner: "Yes",
        MaritalStatus: { "$ne": "married" || "Married" }
    };

    if (req.params.fromAge != 'null') {
        if (req.params.toAge != 'null')
            myMatch["Age"] = { "$gte": +parseInt(fromAge), "$lte": parseInt(toAge) };
        else
            myMatch["Age"] = { "$gte": +parseInt(fromAge) };
    }

    if (req.params.manglik != 'null') {
        myMatch["Manglik"] = manglik;
    }

    if (req.params.martial != 'null') {
        myMatch["MaritalStatus"] = martial;
    }

    if (req.params.gender != 'null') {
        myMatch["Gender"] = gender;
    }

    if (req.params.education != 'null') {
        myMatch["Education"] = parseInt(education);
    }

    if (req.params.city != 'null') {
        myMatch["City"] = parseInt(city);
    }

    if (req.params.citizenShip != 'null') {
        myMatch["Citizenship"] = parseInt(citizenShip);
    }

    if (req.params.native != 'null') {
        myMatch["Native"] = parseInt(native);
    }

    if (req.params.height != 'null') {
        myMatch["PartnerHeight"] = parseInt(height);
    }

    if (req.params.handicap != 'null') {
        myMatch["Handicaped"] = handicap;
    }
    var query1 = ([
        {
            $match: myMatch
        },
        //{
        //    $project:{
        //        FamilyMemberId: '$FamilyMemberId',
        //        MemberId:'$MemberId',
        //        Name: '$Name',
        //        BloodGroup: '$BloodGroup',
        //        Email: '$Email',
        //        FileNameInFolder: '$FileNameInFolder',
        //        Filename: '$Filename',
        //        Mobile:'$Mobile'
        //    }
        //},
        {
            $lookup:
            {
                from: 'Height',
                localField: 'PartnerHeight',
                foreignField: 'HeightId',
                as: 'HeightData'
            }
        },
        {
            $lookup:
            {
                from: 'Citizenship',
                localField: 'Citizenship',
                foreignField: 'CitizenshipId',
                as: 'CitizenshipData'
            }
        },
        {
            $lookup:
            {
                from: 'City',
                localField: 'City',
                foreignField: 'CityId',
                as: 'CityData'
            }
        },
        {
            $lookup:
            {
                from: 'Education',
                localField: 'Education',
                foreignField: 'EducationId',
                as: 'EducationData'
            }
        },
        {
            $lookup:
            {
                from: 'Native',
                localField: 'Native',
                foreignField: 'NativeId',
                as: 'NativeData'
            }
        },
        {
            $project: {
                FamilyMemberId: '$FamilyMemberId',
                MemberId: '$MemberId',
                Name: '$Name',
                BloodGroup: '$BloodGroup',
                Email: '$Email',
                FileNameInFolder: '$FileNameInFolder',
                Filename: '$Filename',
                Mobile: '$Mobile',
                HeightData: "$HeightData",
                CitizenshipData: '$CitizenshipData',
                CityData: '$CityData',
                EducationData: '$EducationData',
                NativeData: '$NativeData'
            }
        }
    ]);
    familyMember.aggregate(query1).exec(function (err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
};

exports.matrimonialDefaultImage = function (req, res) {
    res.sendFile(path.resolve('./Photos/MatrimonialDefaultImage.png'));
};

exports.getCommitteeMemberTypes = function (req, res) {
    CommitteeTypes.find({}, function (err, CommitteeTypes) {
        if (err)
            res.send(err);
        res.json(CommitteeTypes);
    });
};

exports.getAllCommitteeMembers = function (req, res) {
    Committee.aggregate([
        {
            $lookup:
            {
                from: 'Member',
                localField: 'MemberId',
                foreignField: '_id',
                as: 'CommitteeMemberData'
            }
        },
        {
            $lookup:
            {
                from: 'Designation',
                localField: 'CommitteeMemberDesignation',
                foreignField: 'DesignationId',
                as: 'DesignationData'
            },
        },
        {
            $lookup:
            {
                from: 'CommitteeMemberType',
                localField: 'MemberType',
                foreignField: 'TypeId',
                as: 'CommitteeMemberTypesData'
            },
        },
        {
            "$sort": {
                "CommitteeMemberTypesData.TypeId": 1,
            }
        }, {
            $unwind: { path: "$DesignationData" }
        }, {
            $unwind: { path: "$CommitteeMemberData" }
        },
        {
            $unwind: { path: "$CommitteeMemberTypesData" }
        },
        {
            "$sort": {
                "DesignationData.DesignationId": 1

            }
        },
    ]).exec(function (err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
};

exports.searchCommitteeMember = function (req, res) {
    var commiteeMemberType = req.params.memberTypeValue == 'All' ? '' : req.params.memberTypeValue;
    var searchValue = req.params.searchValue;
    var fieldName = req.params.fieldName;
    var regex = new RegExp(req.params.searchValue, 'i');
    var query = {};

    if (req.params.memberTypeValue != 'null') {
        query["CommitteeMemberTypesData.Description"] = req.params.memberTypeValue;
    }
    if (fieldName == 'CommitteeMemberData.FullName') {
        query["name"] = regex;
    }
    if (fieldName == 'CommitteeMemberData.Email') {
        query["CommitteeMemberData.Email"] = regex;
    }
    if (fieldName == 'DesignationData.Designation') {
        query["DesignationData.Designation"] = regex;
    }
    if (fieldName == 'CommitteeMemberData.FullName') {
        Committee.aggregate([
            {
                $lookup:
                {
                    from: 'Member',
                    localField: 'MemberId',
                    foreignField: '_id',
                    as: 'CommitteeMemberData'
                }
            },
            {
                $lookup:
                {
                    from: 'Designation',
                    localField: 'CommitteeMemberDesignation',
                    foreignField: 'DesignationId',
                    as: 'DesignationData'
                },
            },
            {
                $lookup:
                {
                    from: 'CommitteeMemberType',
                    localField: 'MemberType',
                    foreignField: 'TypeId',
                    as: 'CommitteeMemberTypesData'
                },
            },
            {
                "$sort": {
                    "CommitteeMemberTypesData.TypeId": 1,
                }
            },
            {
                $unwind: { path: "$DesignationData" }
            }, {
                $unwind: { path: "$CommitteeMemberData" }
            },
            {
                $unwind: { path: "$CommitteeMemberTypesData" }
            },
            {
                "$sort": {
                    "DesignationData.DesignationId": 1

                }
            },
            { $project: { 'CommitteeMemberDesignation': 1, 'CommitteeMemberId': 1, 'MemberId': 1, 'CommitteeMemberTypesData': '$CommitteeMemberTypesData', 'CommitteeMemberData': '$CommitteeMemberData', 'DesignationData': '$DesignationData', name: "$CommitteeMemberData.FullName" } },
            { $match: query },
        ]).exec(function (err, data) {
            if (err)
                res.send(err);
            res.json(data);
        });
    }
    else {
        Committee.aggregate([
            {
                $lookup:
                {
                    from: 'Member',
                    localField: 'MemberId',
                    foreignField: '_id',
                    as: 'CommitteeMemberData'
                }
            },
            {
                $lookup:
                {
                    from: 'Designation',
                    localField: 'CommitteeMemberDesignation',
                    foreignField: 'DesignationId',
                    as: 'DesignationData'
                },
            },
            {
                $lookup:
                {
                    from: 'CommitteeMemberType',
                    localField: 'MemberType',
                    foreignField: 'TypeId',
                    as: 'CommitteeMemberTypesData'
                },
            },
            {
                "$sort": {
                    "CommitteeMemberTypesData.TypeId": 1,
                }
            },
            {
                $unwind: { path: "$DesignationData" }
            }, {
                $unwind: { path: "$CommitteeMemberData" }
            },
            {
                $unwind: { path: "$CommitteeMemberTypesData" }
            },
            {
                "$sort": {
                    "DesignationData.DesignationId": 1

                }
            },
            { $match: query }
        ]).exec(function (err, data) {
            if (err)
                res.send(err);
            res.json(data);
        });
    }
}

exports.getMatrimonialGirltImage = function (req, res) {
    res.sendFile(path.resolve('./Photos/matrimonialGirlImage.png'));
};

exports.getEventImage = function (req, res) {
    res.sendFile(path.resolve('./Photos/defaultEventImage.jpg'));
};

exports.checkMember = function (req, res) {
    var email = req.params.email;
    var otp = req.params.otp;
    otpAuthentication.find({
        EmailAddress: email
    },
        ['type', 'CreatedTime', 'OTP', 'EmailAddress', 'ExpiredTime'],
        {
            skip: 0,
            limit: 1,
            sort: {
                CreatedTime: -1
            }
        },
        function (err, data) {
            if (err)
                res.status(500).send('Internal server error');
            else if (data) {
                if (data[0].OTP == otp)
                    res.send(data);
                else
                    res.send('OTP is not valid');
            }
            else
                res.send('Email is not found');
        })
};

exports.joinBannersWithPhotos = function (req, res) {
    var i = 0;
    bannerManagement.aggregate([
        {
            $lookup:
            {
                from: 'BannerPhoto',
                localField: 'BannerId',
                foreignField: 'BannerId',
                as: 'BannerWithPhoto'
            }
        }
    ]).exec(function (err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
}

exports.getBannerPhoto = function (req, res) {
    var fileLocation = './Photos/Banners/' + req.params.BannerId + '/' + req.params.fileName;
    if (fs.existsSync(fileLocation)) {
        res.sendFile(path.resolve(fileLocation));
    }
};

exports.getRecentlyJoinedMembers = function (req, res) {
    member.aggregate([
        {
            $sort: { _id: -1 },
        },
        {
            $limit: 3
        }
    ]).exec(function (err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
};

exports.getStatisticsInfo = function (req, res) {
    var Male = 0;
    var Female = 0;
    var MemberCount = 0;
    member.find({}, function (err, member) {
        if (err)
            res.send(err);
        else
            MemberCount = member.length;
        for (var i = 0; i < member.length; i++) {
            if (member[i].Gender) {
                member[i].Gender.toLowerCase() == 'male' ? Male++ : Female++;
            }
        }
    });

    familyMember.find({}, function (err, familymember) {
        if (err)
            res.send(err);
        else
            for (var i = 0; i < familymember.length; i++) {
                if (familymember[i].Gender) {
                    familymember[i].Gender.toLowerCase() == 'male' ? Male++ : Female++;
                }
            }
        res.json({ memberCont: MemberCount, familyMemberCount: familymember.length, maleCount: Male, femaleCount: Female });
    });

};

exports.upcomingEvent = function (req, res) {
    var currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    eventManagement.aggregate([

        {
            $lookup:
            {
                from: 'EventPhotos',
                localField: 'EventId',
                foreignField: 'EventId',
                as: 'EventWithPhoto'
            }
        },
        {
            $project: {
                date: {
                    $dateFromString: {
                        dateString: '$EventDate'
                    }
                },
                EventDescription: '$EventDescription',
                EventDate: '$EventDate',
                EventVenue: '$EventVenue',
                IsPublished: '$IsPublished',
                EventName: '$EventName',
                IsActive: '$IsActive',
                EventId: '$EventId',
                EventWithPhoto: '$EventWithPhoto',
            }
        },
        {
            $match: {
                date: { $gte: currentDate },
                IsActive: true
            }
        },
        {
            $sort: { date: 1 }
        },
        {
            $limit: 3
        }
    ]).exec(function (err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
}
