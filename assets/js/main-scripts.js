// plug it in, plug it in
function load() {
	var someData_notJSON = JSON.parse(data);
	console.log("someData_notJSON", someData_notJSON[0].red);
}
if (localStorage.getItem('plans')) {
	localStorage.removeItem('plans');
}
(function ($) {

	var paraCount = function () {

		return {

			options: {
				itemClass: 'awesome',
				appPath: window.location.origin,
				// baseUrl2: baseUrl,
				navPath: "",
				apiUrl: baseApiUrl,
				callMe: function () {
					console.log("ring, ring...");
				}
			},

			// --------------------------------------------------------------------

			init: function (options, element) {
				this.options = $.extend(this.options, options);
				this.elem = element;
				this.attachEvents();
			},

			// --------------------------------------------------------------------

			attachEvents: function () {
				var self = this;
				if (localStorage.getItem("sessionId")) {
					window.location.href = location.origin + "/app/dashboard/home.html";
				}
				var urlArr = ['login', 'signup', 'forgotPassword', 'home', 'account', 'share'];
				// $.each(urlArr, function (index, value) {
				// 	if (window.location.href.indexOf(urlArr + '.html') <= -1) {
				// 		if (window.location.href.indexOf(value) >= 0) {
				// 			window.location = self.options.appPath +'app/auth/'+ value + '.html';
				// 		}
				// 	}
				// });


				$('.transition').on('focus', function () {
					$(this).next('.invalid-feedback').remove();
				});

				/* Resume Signin functionlity */
				$('#signinResume').on('click', function () {
					self.loginResumeUser();
				});

				/* Resume Signup functionlity */
				$('#signupResume').on('click', function () {
					self.singnupResumeUser();
				});

				/* Reset Password functionality */
				$('#resetPassBtn').on('click', function () {
					self.resetPassword();
				});

				/*$('input').on('keypress', function(e) {
					if (e.which == 32)
						return false;
				});*/

				$('body').on('keydown', function (e) {
					var key = e.which;
					if (key === 13) {
						if ($(this).attr('id') == 'login') self.loginResumeUser();
						if ($(this).attr('id') == 'signup') self.singnupResumeUser();
						if ($(this).attr('id') == 'forgotPassword') self.resetPassword();
					}
				});

			},

			loginResumeUser: function () {
				var self = this;
				let username = $('input[name="email"]').val();
				let password = $('input[name="password"]').val();

				$('.invalid-feedback').remove();
				var validate = true;
				if ($.trim(username).length <= 0) {
					validate = false;
					$('<div class="invalid-feedback">Email is required.</div>').insertAfter('input[name="email"]');
				} else {
					var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
					if (!emailReg.test(username)) {
						validate = false;
						$('<div class="invalid-feedback">Please enter valid email.</div>').insertAfter('input[name="email"]');
					}
				}
				if ($.trim(password).length <= 0) {
					validate = false;
					$('<div class="invalid-feedback">Password is required.</div>').insertAfter('input[name="password"]');
				}

				if (validate) {
					$('#signinResume').attr('disabled', true);
					let signupData = {
						"username": username,
						"password": password
					};

					// console.log(signupData);
					doPostWithOutAuth(baseApiUrl + serviceUrls.post.loginResumeUser, signupData).then(response => {
						console.log(response);
						response = typeof (response) !== "object" ? JSON.parse(response) : response;
						localStorage.clear();
						if (response.status == "success") {
							// localStorage.setItem('sessionId', response.sessionId);
							localStorage.setItem(btoa('sessionId_' + window.location.origin), btoa(response.sessionId));
							localStorage.setItem("templateId", 2);
							// localStorage.setItem('userData', JSON.stringify(response.data));
							localStorage.setItem(encrypt('userData', response.sessionId), encrypt(JSON.stringify(response.data), response.sessionId));
							// localStorage.setItem('fromPage', 'signin');
							// localStorage.setItem('shareName', response.data.share_name);
							localStorage.setItem(btoa('imageStore'), btoa(response.data.pic));
							window.location.href = window.location.origin + "/app/dashboard/home.html";
						} else {
							$('.loading-container').css('display', 'none');
							$('#newErrorMessageID').html(response.msg.description)
								.fadeIn()
								.delay(3000)
								.fadeOut('slow', function () {
									$('#signinResume').attr('disabled', false);
								});
						}
					});
				}
			},

			singnupResumeUser: function () {
				var self = this;
				let firstname = $.trim($('input[name="firstname"]').val());
				let lastname = $.trim($('input[name="lastname"]').val());
				let email = $.trim($('input[name="email"]').val());
				let password = $.trim($('input[name="password"]').val());

				$('.invalid-feedback').remove();

				var validate = true;
				if ($.trim(firstname).length <= 0) {
					validate = false;
					$('<div class="invalid-feedback">First Name is required.</div>').insertAfter('input[name="firstname"]');
				} else {
					if ($.trim(firstname).length < 1) {
						validate = false;
						$('<div class="invalid-feedback">Minimum 1 character is required.</div>').insertAfter('input[name="firstname"]');
					}
				}

				if ($.trim(lastname).length <= 0) {
					validate = false;
					$('<div class="invalid-feedback">Last Name is required.</div>').insertAfter('input[name="lastname"]');
				} else {
					if ($.trim(lastname).length < 1) {
						validate = false;
						$('<div class="invalid-feedback">Minimum 1 character is required.</div>').insertAfter('input[name="lastname"]');
					}
				}
				if ($.trim(email).length <= 0) {
					validate = false;
					$('<div class="invalid-feedback">Email is required.</div>').insertAfter('input[name="email"]');
				} else {
					var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
					if (!emailReg.test(email)) {
						validate = false;
						$('<div class="invalid-feedback">Please enter valid email.</div>').insertAfter('input[name="email"]');
					}
				}
				if ($.trim(password).length <= 0) {
					validate = false;
					$('<div class="invalid-feedback">Password is required.</div>').insertAfter('input[name="password"]');
				} else if ($.trim(password).length < 8) {
					validate = false;
					$('<div class="invalid-feedback">Password must be 8 characters. </div>').insertAfter('input[name="password"]');
				}

				if (validate) {

					$('#signupResume').attr('disabled', true);

					let signupData = {
						"firstname": firstname,
						"lastname": lastname,
						"email": email,
						"password": password
					};

					//console.log(signupData);
					// var settings = {
					// 	"async": true,
					// 	"crossDomain": true,
					// 	"url": baseApiUrl + serviceUrls.post.signupResume,
					// 	"method": "POST",
					// 	"headers": {
					// 		"token": authToken,
					// 		"content-type": "application/json"
					// 	},
					// 	"processData": false,
					// 	"data": JSON.stringify(signupData)
					// }
					// $('.loading-container').css('display', 'block');
					// $.ajax(settings).done(function (response) {
					// 	console.log('response new', response);
					// 	localStorage.clear();
					// 	if (response.status == "success") {
					// 		// localStorage.setItem('userStatus', response.data.sessionId);
					// 		localStorage.setItem('sessionId', response.data.sessionId);
					// 		localStorage.setItem('userData', JSON.stringify(response.data));
					// 		localStorage.setItem('shareName', response.shareName);
					// 		localStorage.setItem('fromPage', 'signup');
					// 		localStorage.setItem('imageStore', '');
					// 		window.location.href = window.location.origin + "/app/dashboard/home.html";
					// 	} else {
					// 		$('.loading-container').css('display', 'block');
					// 		$('#newErrorMessageID').html(response.msg.description)
					// 			.fadeIn()
					// 			.delay(3000)
					// 			.fadeOut('slow', function () {
					// 				$('#signupResume').attr('disabled', false);
					// 			});
					// 	}

					// });
					$('.loading-container').css('display', 'block');
					doPostWithOutAuth(baseApiUrl + serviceUrls.post.signupResume, signupData).then(response => {
						console.log('response new', response);
						localStorage.clear();
						if (response.status == "success") {
							// localStorage.setItem('userStatus', response.data.sessionId);
							localStorage.setItem(btoa('sessionId_' + window.location.origin), btoa(response.data.sessionId));
							// localStorage.setItem('userData', JSON.stringify(response.data));
							localStorage.setItem(encrypt('userData', response.data.sessionId), encrypt(JSON.stringify(response.data), response.data.sessionId));
							// localStorage.setItem('shareName', response.shareName);
							// localStorage.setItem('fromPage', 'signup');
							localStorage.setItem(btoa('imageStore'), '');
							window.location.href = window.location.origin + "/app/dashboard/home.html";
						} else {
							$('.loading-container').css('display', 'none');
							$('#newErrorMessageID').html(response.msg.description)
								.fadeIn()
								.delay(3000)
								.fadeOut('slow', function () {
									$('#signupResume').attr('disabled', false);
								});
						}
					});
				}
			},

			resetPassword: function () {
				$('.invalid-feedback').remove();
				var self = this;
				var email = $('input[name="email"]').val();
				var validate = true;

				if ($.trim(email).length <= 0) {
					validate = false;
					$('<div class="invalid-feedback">Email is required.</div>').insertAfter('input[name="email"]');
				} else {
					var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
					if (!emailReg.test(email)) {
						validate = false;
						$('<div class="invalid-feedback">Please enter valid email.</div>').insertAfter('input[name="email"]');
					}
				}

				if (validate) {
					$('#resetPassBtn').attr('disabled', true);
					let userData = {
						'username': email
					};
					// var settings = {
					// 	"async": true,
					// 	"crossDomain": true,
					// 	"url": baseApiUrl + serviceUrls.post.resetPasswordLinkToEmailResume,
					// 	"method": "POST",
					// 	"headers": {
					// 		"token": authToken,
					// 		"content-type": "application/json",
					// 		"cache-control": "no-cache",
					// 	},
					// 	"processData": false,
					// 	"data": userData
					// }

					// $.ajax(settings).done(function (response) {

					// });
					doPostWithOutAuth(baseApiUrl + serviceUrls.post.resetPasswordLinkToEmailResume, userData).then(response => {
						console.log(response);
						if (response.status == "success") {
							$('#newSuccessMessageID .message-text').html(response.msg.description);
							$('#newSuccessMessageID').html(response.msg.description)
								.fadeIn()
								.delay(3000)
								.fadeOut();
						} else {
							$('#newErrorMessageID .message-text').html(response.msg.description)
							$('#newErrorMessageID').html(response.msg.description)
								.fadeIn()
								.delay(3000)
								.fadeOut('slow', function () {
									$('#resetPassBtn').attr('disabled', false);
								});
						}
					})

				}
			},

		};

	};

	// --------------------------------------------------------------------

	$.fn.paraCount = function (options) {
		// create an instance for each element in the set
		// console.log(options);
		// return;
		return this.each(function () {
			var myParaCount = new paraCount();
			myParaCount.init(options, this);
			// console.log(this);
			// this lets us call methods on the selector
			$(this).data("paraCount", myParaCount);
		});
	};

})(jQuery);