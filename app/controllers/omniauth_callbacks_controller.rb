class OmniauthCallbacksController < Devise::OmniauthCallbacksController

	def omniauth_network_login
		#raise request.env["omniauth.auth"].to_yaml
		user = User.find_or_create_omniauth(request.env["omniauth.auth"])
		if user.persisted?
			flash.notice = "Signed in with " + user.provider + "!"
			sign_in user
			redirect_to root_path
		else
			redirect_to :back
			flash.notice = "There was an error, please try another service."
		end
	end

	alias_method :facebook, :omniauth_network_login
	alias_method :github, :omniauth_network_login
	alias_method :twitter, :omniauth_network_login
end
