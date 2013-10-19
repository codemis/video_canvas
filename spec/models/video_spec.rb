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
end
