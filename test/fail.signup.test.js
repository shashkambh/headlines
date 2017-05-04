var webdriver = require('selenium-webdriver'),
	By = webdriver.By,
	until = webdriver.until;

var driver = new webdriver.Builder()
	.forBrowser('chrome')
	.build();
driver.get('http://localhost:3000');



driver.findElement(By.name('signup')).click(); //verify requests

//driver.findElement(By.name('btnG')).click();
//driver.wait(webdriver.until.findElement(By.name('')))

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