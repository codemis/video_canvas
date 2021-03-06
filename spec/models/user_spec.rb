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

	describe "relationships" do
		
		it "should allow a user to have an annotation associated to it. " do
			user = FactoryGirl.create(:defaulted_user)
			video = FactoryGirl.create(:defaulted_video)
			annotation = FactoryGirl.create(:position_annotation, user_id: user.id, video_id: video.id)

			user.annotations.length.should == 1
			user.annotations.first.should == annotation
		end

		it "should allow a user to have an video through an annotation" do
			user = FactoryGirl.create(:defaulted_user)
			video = FactoryGirl.create(:defaulted_video)
			annotation = FactoryGirl.create(:position_annotation, user_id: user.id, video_id: video.id)

			user.videos.length.should == 1
			user.videos.first.should == video
		end

	end

	describe "methods" do

		it "should generate new avatar text that contains the text that is passed in" do
			first = User.generate_new_avatar_text("blah")
			second = User.generate_new_avatar_text("blah")

			first.should_not == second
		end

		it "should take all the annotations associated with a guest user and assign them to the new authenticated user" do
			guest_user = FactoryGirl.create(:defaulted_user)
			authenticated_user = FactoryGirl.create(:defaulted_user, username: "authenticated user")
			video = FactoryGirl.create(:defaulted_video)
			annotation = FactoryGirl.create(:position_annotation, user_id: guest_user.id, video_id: video.id)

			guest_user.annotations.length.should == 1
			authenticated_user.annotations.length.should == 0

			User.sync_user_annotations(authenticated_user, guest_user.id)

			
			u2 = User.find(authenticated_user.id)
			u2.annotations.length.should == 1
		end

	end
end
