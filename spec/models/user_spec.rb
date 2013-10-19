require 'spec_helper'

describe User do
	describe "validations" do

		it "should create a valid user with just a username and avatar text" do
			FactoryGirl.create(:user, username: "username", avatar_text: "username1234").should be_valid
		end

		it "should not create a valid user without a username or avatar_text" do
			FactoryGirl.build(:user, username: "", avatar_text: "username1234").should_not be_valid
			FactoryGirl.build(:user, username: "username", avatar_text: "").should_not be_valid
			FactoryGirl.build(:user, username: "", avatar_text: "").should_not be_valid
		end

		it "should validate the uniqueness of the username" do
			FactoryGirl.create(:user, username: "username", avatar_text: "username1234").should be_valid
			FactoryGirl.build(:user, username: "username", avatar_text: "username1234").should_not be_valid
		end

	end

	describe "methods" do

		it "should generate new avatar text that contains the text that is passed in" do
			first = User.generate_new_avatar_text("blah")
			second = User.generate_new_avatar_text("blah")

			first.should_not == second
		end

	end
end
