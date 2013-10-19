require 'spec_helper'

describe Annotation do
  describe "validations" do
  	
  	it "should create a valid annotation record" do
  		user = FactoryGirl.create(:defaulted_user)
  		video = FactoryGirl.create(:defaulted_video)
  		FactoryGirl.create(:defaulted_annotation, user_id: user.id, video_id: video.id, position: {x: 13, y: 15, width: 230, height: 500}).should be_valid
  	end

  	it "should not create a valid annotation record if any of the required fields are missing." do
  		user = FactoryGirl.create(:defaulted_user)
  		video = FactoryGirl.create(:defaulted_video)
  		FactoryGirl.build(:defaulted_annotation, user_id: nil, video_id: video.id, position: {x: 13, y: 15, width: 230, height: 500}).should_not be_valid
  		FactoryGirl.build(:defaulted_annotation, user_id: user.id, video_id: nil, position: {x: 13, y: 15, width: 230, height: 500}).should_not be_valid
  		FactoryGirl.build(:defaulted_annotation, user_id: user.id, video_id: video.id, position: nil).should_not be_valid
  		FactoryGirl.build(:defaulted_annotation, user_id: user.id, video_id: video.id, position: {x: 13, y: 15, width: 230, height: 500}, annotation_type: nil).should_not be_valid
  		FactoryGirl.build(:defaulted_annotation, user_id: user.id, video_id: video.id, position: {x: 13, y: 15, width: 230, height: 500}, start_time: nil).should_not be_valid
  		FactoryGirl.build(:defaulted_annotation, user_id: user.id, video_id: video.id, position: {x: 13, y: 15, width: 230, height: 500}, stop_time: nil).should_not be_valid
  	end

  end

  describe "relationships" do
  	
  	it "allow an annotation to belong to both a user and a video" do
  		user_1 = FactoryGirl.create(:defaulted_user)
  		video_1 = FactoryGirl.create(:defaulted_video)
  		FactoryGirl.create(:position_annotation, user_id: user_1.id, video_id: video_1.id)
  		annotation = Annotation.first
  		
  		annotation.user.should == user_1
  		annotation.video.should == video_1
  	end

  end
end
