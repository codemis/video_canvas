class UsersController < ApplicationController

	def create_guest_user
		puts "cheesecake"
		puts params[:username]
		@user = User.new(username: params[:username], guest_user: true, avatar_text: User.generate_new_avatar_text(params[:username]))
		if @user.save
			session[:guest_user_id] = @user.id
			sign_in_and_redirect(@user)
			flash[:notice] = "User successfully created"
		else
			redirect_to :back
			flash[:alert] = @user.errors.full_messages.to_sentence
		end
	end
	
end
