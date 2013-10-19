require 'spec_helper'

describe Video do
  describe "validations" do

  	it "should create a valid video record so long as video url and youtube id are present" do
  		FactoryGirl.create(:video, video_url: "video url", youtube_id: "youtube_id").should be_valid
  	end

  	it "should not create a valid video record if either the video url or youtube id is missing" do
  		FactoryGirl.build(:video, video_url: "", youtube_id: "youtube_id").should_not be_valid
  		FactoryGirl.build(:video, video_url: "video url", youtube_id: "").should_not be_valid
  		FactoryGirl.build(:video, video_url: "", youtube_id: "").should_not be_valid	
  	end

  end

  describe "relationships" do
    
    it "should allow a video to have an annotation associated to it. " do
      user = FactoryGirl.create(:defaulted_user)
      video = FactoryGirl.create(:defaulted_video)
      annotation = FactoryGirl.create(:position_annotation, user_id: user.id, video_id: video.id)

      video.annotations.length.should == 1
      video.annotations.first.should == annotation
    end

    it "should allow a video to have users through an annotation" do
      user = FactoryGirl.create(:defaulted_user)
      video = FactoryGirl.create(:defaulted_video)
      annotation = FactoryGirl.create(:position_annotation, user_id: user.id, video_id: video.id)

      video.users.length.should == 1
      video.users.first.should == user
    end

  end
end
