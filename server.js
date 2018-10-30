var express = require('express'), app = express(), mongoose = require('mongoose'), members = require('./api/models/MemberModel'), familymembers = require('./api/models/FamilyMemberModel'), committee = require('./api/models/committeeMemberModel'), login = require('./api/models/LoginModel'), eventManagement = require('./api/models/EventManagementModel'), eventPhoto = require('./api/models/EventPhotosModel'), userModule = require('./api/models/UserModuleModel'), securityModule = require('./api/models/SecurityModuleModel'), otpAuthenication = require('./api/models/OTPAuthenticationModel'), advertisement = require('./api/models/AdvertisementModel'), height = require('./api/models/HeightModel'), city = require('./api/models/CityModel'), native = require('./api/models/NativeModel'), education = require('./api/models/EducationModel'), cityzenship = require('./api/models/CitizenshipModel'), designation = require('./api/models/Designation'), advertisementType = require('./api/models/AdvertisementTypeModel'), advertisementLocation = require('./api/models/AdvertisementLocationModel'), advertisementPhoto = require('./api/models/AdvertisementPhotos'), bannerManagement = require('./api/models/BannerManagementModel'), bannerPhoto = require('./api/models/BannerPhotos'), bodyParser = require('body-parser'), jwt = require('jsonwebtoken'), config = require('./Config'), fileUpload = require('express-fileupload'), cookieParser = require('cookie-parser'), port = process.env.PORT || 8080;
var cors = require('cors');
app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(fileUpload());
mongoose.Promise = global.Promise;
mongoose.connect(config.databaseURL);
app.set('superSecret', config.secret);
app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));
app.use(function (err, req, res, next) {
    res.send({ error: err.message });
});
var apiRoutes = express.Router();
var routes = require('./api/routes/Routes');
routes(app);
app.use('/api', apiRoutes);
app.use(function (req, res) {
    res.status(404).send({ url: req.originalUrl + ' not found' });
});
app.listen(port);
console.log('UGPS Node API server started on: ' + port);
//# sourceMappingURL=server.js.map