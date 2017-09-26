module.exports = function (app, db) {
	//insert data in users table
	db.serialize(()=>{
		db.run("CREATE TABLE users (id NUMBER,firstName TEXT,lastName TEXT,username TEXT,email TEXT,age NUMBER)");
		var stmt = db.prepare("INSERT INTO users VALUES (?,?,?,?,?,?)");
		for (var i = 1; i <= 10; i++) {
			let text = 'abcdefghijklmnopqrstuvwxyz',
				textLength = text.length,
				firstNameRandom = text.charAt(Math.floor(Math.random() * textLength)),
				lastNameRandom = text.charAt(Math.floor(Math.random() * textLength)),
				userNameRandom = text.charAt(Math.floor(Math.random() * textLength)),
				emailRandom = text.charAt(Math.floor(Math.random() * textLength)),
				ageRandom =  Math.floor(Math.random() * 70);
			stmt.run(i,`First Name ${firstNameRandom}`,`Last Name ${lastNameRandom}`,`User Name ${userNameRandom}`,`email-${emailRandom}-@gmail.com`,ageRandom);
		}
		stmt.finalize();
	});

	//get users
	app.get('/users', (req, res) => {
		let users = [];
			sortParams = {sortBy:req.query.sortBy,sortOrder:req.query.sortOrder || 'asc'};
			sortQuery = sortParams.sortBy?`order by ${sortParams.sortBy} ${sortParams.sortOrder}`:'order by id desc',
			whereQuery = '',
			whereQueryArray = [];
		if(req.query.firstName){
			whereQueryArray.push(`firstName like "%${req.query.firstName}%"`)
		}
		if(req.query.lastName){
			whereQueryArray.push(`lastName like "%${req.query.lastName}%"`)
		}
		if(req.query.userName){
			whereQueryArray.push(`userName like "%${req.query.userName}%"`)
		}
		if(req.query.email){
			whereQueryArray.push(`email like "%${req.query.email}%"`)
		}
		if(req.query.age){
			whereQueryArray.push(`age=${req.query.age}`)
		}
		if(whereQueryArray.length){
			whereQuery = ' where '+whereQueryArray.join(' and ');
		}
		query = `SELECT * FROM users ${whereQuery} ${sortQuery}`;
		console.log(query);
		db.all(query, function (err,users) {
			if(err){
				res.sendError(err);
			} else {
				res.sendResponse(users);
			}
		});
	});

	//get user
	app.get('/users/:id', (req, res) => {
		db.all(`SELECT * FROM users where id=${req.params.id}`, function (err,users) {
			res.sendResponse(users);
		});
	});

	//add user
	app.post('/users', (req, res) => {
		let userData = req.body,
			stmt = db.prepare("INSERT INTO users VALUES (?,?,?,?,?,?)"),
			lastId = 0;
		db.get('select id from users order by id desc limit 1',(err,data)=>{
			lastId = data.id+1;
			stmt.run(lastId,
				`${userData.firstName}`,
				`${userData.lastName}`,
				`${userData.userName}`,
				`${userData.email}`,
				userData.age,
				(err)=>{
					if(err){
						res.sendError(err);
					} else {
						res.sendResponse({});
					}
				}
			);
		});
	});

	//update user
	app.put('/users/:id', (req, res) => {
		let userId = req.params.id;
		let userData = req.body;
		db.run(`update users set firstName="${userData.firstName}",lastName="${userData.lastName}",userName="${userData.userName}",email="${userData.email}",age=${userData.age} where id=${userId}`,
			(err,response) => {
				if(err){
					res.sendError(err);
				} else {
					res.sendResponse({});
				}
			});
	});

	//delete user
	app.delete('/users/:id', (req, res) => {
		let usersId = req.params.id;
		db.all(`delete from users where id=${usersId}`, function (err) {
			if(err){
				res.sendError(err);
			} else {
				res.sendResponse({});
			}
		});
	});
};