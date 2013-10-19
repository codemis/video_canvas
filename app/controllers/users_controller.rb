class UsersController < ApplicationController

	def create_guest_user
		puts "cheesecake"
		puts params[:username]
		@user = User.new(username: params[:username])
		if @user.save
			redirect_to root_path
			flash[:notice] = "User successfully created"
		else
			redirect_to :back
			flash[:alert] = @user.errors.full_messages.to_sentence
		end
	end
	
end
