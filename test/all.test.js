var webdriver = require('selenium-webdriver'),
	By = webdriver.By,
	until = webdriver.until;

var driver = new webdriver.Builder()
	.forBrowser('chrome')
	.build();

var newUser = "newUser104"; //TODO change me!
driver.get('http://localhost:3000');

driver.findElement(By.name('home')).click();
driver.wait(check_home_title, 1000);
driver.wait(check_home_url, 1000);

driver.findElement(By.name('signup')).click(); //verify requests
driver.wait(check_signup_title, 1000);
driver.wait(check_signup_url, 1000);

// test old username
driver.findElement({name: 'username'}).sendKeys('ursula@utexas.edu');
driver.findElement({name: 'password'}).sendKeys('test');
driver.findElement(By.name('Signup')).click();

driver.wait(check_signup_title, 1000);
driver.wait(check_signup_url, 1000);

driver.findElement({name: 'username'}).sendKeys('ursula@utexas.edu');
driver.findElement({name: 'password'}).sendKeys('test');
driver.findElement(By.name('login')).click();
//driver.findElement({xpath: '/html/body/div[1]/div/p[1]/name="login"'}).click();

driver.wait(check_login_title, 1000);
driver.wait(check_login_url, 1000);

driver.findElement({name: 'username'}).sendKeys('ursula@utexas.edu');
driver.findElement({name: 'password'}).sendKeys('test');
driver.findElement(By.name('Login')).click();

driver.wait(check_home_title, 1000);
driver.wait(check_home_url, 1000);

// log out the user
driver.findElement(By.name('logout')).click();
driver.wait(check_home_title, 1000);
driver.wait(check_home_url, 1000);

// TODO create a new user

driver.findElement(By.name('login')).click(); //verify requests
driver.wait(check_login_title, 1000);
driver.wait(check_login_url, 1000);

driver.findElement({name: 'username'}).sendKeys(newUser);
driver.findElement({name: 'password'}).sendKeys('test');
driver.findElement(By.name('Login')).click();

driver.wait(check_login_title, 1000);
driver.wait(check_login_url, 1000);

driver.findElement(By.name('home')).click();
driver.wait(check_home_title, 1000);
driver.wait(check_home_url, 1000);

driver.findElement(By.name('login')).click(); //verify requests
driver.wait(check_login_title, 1000);
driver.wait(check_login_url, 1000);

driver.findElement({name: 'username'}).sendKeys(newUser);
driver.findElement({name: 'password'}).sendKeys('test');
driver.findElement(By.name('Login')).click();
driver.wait(check_login_title, 1000);
driver.wait(check_login_url, 1000);


driver.findElement(By.name('signup')).click(); //verify requests
driver.wait(check_signup_title, 1000);
driver.wait(check_signup_url, 1000);

// test new user name
driver.findElement({name: 'username'}).sendKeys(newUser);
driver.findElement({name: 'password'}).sendKeys('test');
driver.findElement(By.name('Signup')).click();

driver.wait(check_home_title, 1000);
driver.wait(check_home_url, 1000);

// log out and then have them log back in
driver.findElement(By.name('logout')).click();
driver.wait(check_home_title, 1000);
driver.wait(check_home_url, 1000);

driver.findElement(By.name('login')).click(); //verify requests
driver.wait(check_login_title, 1000);
driver.wait(check_login_url, 1000);

driver.findElement({name: 'username'}).sendKeys(newUser);
driver.findElement({name: 'password'}).sendKeys('test');
driver.findElement(By.name('Login')).click();

driver.wait(check_home_title, 1000);
driver.wait(check_home_url, 1000);

// log out and then have them log back in
driver.findElement(By.name('logout')).click();
driver.wait(check_home_title, 1000);
driver.wait(check_home_url, 1000);


// preferences

driver.findElement(By.name('login')).click(); //verify requests

driver.wait(check_login_title, 1000);
driver.wait(check_login_url, 1000);

// test old username
driver.findElement({name: 'username'}).sendKeys('ursula@utexas.edu');
driver.findElement({name: 'password'}).sendKeys('test');
driver.findElement(By.name('Login')).click();

driver.wait(check_home_title, 1000);
driver.wait(check_home_url, 1000);

//test preferences
driver.findElement(By.name('preferences')).click();

driver.wait(check_preferences_title, 1000);
driver.wait(check_preferences_url, 1000);

driver.findElement({id: 'CNN'}).click();
driver.findElement({id: 'Yahoo'}).click();
driver.findElement({id: 'BBC'}).click();
driver.findElement({id: 'CNBC'}).click();
driver.findElement({id: 'Fox'}).click();

cnnIsChecked = driver.findElement(By.id("CNN")).isSelected;
yahooIsChecked = driver.findElement(By.id("Yahoo")).isSelected;
bbcIsChecked = driver.findElement(By.id("BBC")).isSelected;
cnbcIsChecked = driver.findElement(By.id("CNBC")).isSelected;
foxIsChecked = driver.findElement(By.id("Fox")).isSelected;
driver.wait(check_preferences_url, 1000);
//console.log("cnn!", cnnIsChecked);
//console.log("cnn checked", cnnIsChecked==true)

driver.findElement(By.name('submit')).click();
driver.wait(check_home_title, 1000);
driver.wait(check_home_url, 1000);

driver.findElement(By.name('preferences')).click();
driver.wait(check_preferences_title, 1000);
driver.wait(check_preferences_url, 1000);
// go back to settings and check that the results are saved
check_checkbox_saved(cnnIsChecked, "CNN");
check_checkbox_saved(yahooIsChecked, "Yahoo");
check_checkbox_saved(bbcIsChecked, "BBC");
check_checkbox_saved(cnbcIsChecked, "CNBC");
check_checkbox_saved(foxIsChecked, "Fox");
//assert(cnnIsChecked == driver.findElement(By.id("CNN")).isSelected);
// go back to the main page
driver.findElement(By.name('home')).click();
driver.wait(check_home_title, 1000);
driver.wait(check_home_url, 1000);

driver.findElement(By.name('home')).click();
driver.wait(check_home_title, 1000);
driver.wait(check_home_url, 1000);

// log out and check that the preferences saved
driver.findElement(By.name('logout')).click();
driver.wait(check_home_title, 1000);
driver.wait(check_home_url, 1000);

driver.findElement(By.name('login')).click(); //verify requests

driver.wait(check_login_title, 1000);
driver.wait(check_login_url, 1000);

// test old username
driver.findElement({name: 'username'}).sendKeys('ursula@utexas.edu');
driver.findElement({name: 'password'}).sendKeys('test');
driver.findElement(By.name('Login')).click();

driver.wait(check_home_title, 1000);
driver.wait(check_home_url, 1000);

//test preferences
driver.findElement(By.name('preferences')).click();

driver.wait(check_preferences_title, 1000);
driver.wait(check_preferences_url, 1000);


check_checkbox_saved(cnnIsChecked, "CNN");
check_checkbox_saved(yahooIsChecked, "Yahoo");
check_checkbox_saved(bbcIsChecked, "BBC");
check_checkbox_saved(cnbcIsChecked, "CNBC");
check_checkbox_saved(foxIsChecked, "Fox");

driver.findElement(By.name('home')).click();
driver.wait(check_home_title, 1000);
driver.wait(check_home_url, 1000);



function check_signup_title(){
	var promise = driver.getTitle().then( function(title){
		
		if(title === 'Signup'){
			console.log('success');
			return true;
		} else{
			console.log('fail -- ' + title);
		}
	});
	return promise;
} 

function check_signup_url(){
	var promise = driver.getCurrentUrl().then( function(url){
		
		if(url === 'http://localhost:3000/signup'){
			console.log('success');
			return true;
		} else{
			console.log('fail -- ' + url);
		}
	});
	return promise;
}



function check_checkbox_saved(expectedCheckBox, site){
	var promise = driver.findElement(By.id(site)).then( function(siteSelected){
		
		if(expectedCheckBox === siteSelected.isSelected){
			console.log('success');
			return true;
		} else{
			console.log('fail -- ' + title);
		}
	});
	return promise;
}

function check_login_title(){
	var promise = driver.getTitle().then( function(title){
		
		if(title === 'Login'){
			console.log('success');
			return true;
		} else{
			console.log('fail -- ' + title);
		}
	});
	return promise;
} 

function check_login_url(){
	var promise = driver.getCurrentUrl().then( function(url){
		
		if(url === 'http://localhost:3000/login'){
			console.log('success');
			return true;
		} else{
			console.log('fail -- ' + url);
		}
	});
	return promise;
} 

function check_home_title(){
	var promise = driver.getTitle().then( function(title){
		
		if(title === 'Headlines'){
			console.log('success');
			return true;
		} else{
			console.log('fail -- ' + title);
		}
	});
	return promise;
} 

function check_home_url(){
	var promise = driver.getCurrentUrl().then( function(url){
		
		if(url === 'http://localhost:3000/'){
			console.log('success');
			return true;
		} else{
			console.log('fail -- ' + url);
		}
	});
	return promise;
} 

function check_preferences_title(){
	var promise = driver.getTitle().then( function(title){
		
		if(title === 'Settings'){
			console.log('success');
			return true;
		} else{
			console.log('fail -- ' + title);
		}
	});
	return promise;
} 

function check_preferences_url(){
	var promise = driver.getCurrentUrl().then( function(url){
		
		if(url === 'http://localhost:3000/preferences'){
			console.log('success');
			return true;
		} else{
			console.log('fail -- ' + url);
		}
	});
	return promise;
} 
