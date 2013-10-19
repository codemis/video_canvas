require 'spec_helper'

describe VideoCategory do
  describe "validations" do
  	it "should create a valid video categories record" do
  		category = FactoryGirl.create(:category, name: "asdfasdf", youtube_id: 123)
  		video = FactoryGirl.create(:video, video_url: "video url", youtube_id: "youtube_id")
  		FactoryGirl.create(:video_category, video_id: video.id, category_id: category.id).should be_valid
  	end

  	it "should not create a valid video category record with either a video or category id missing" do
  		category = FactoryGirl.create(:category, name: "asdfasdf", youtube_id: 123)
  		video = FactoryGirl.create(:video, video_url: "video url", youtube_id: "youtube_id")
  		FactoryGirl.build(:video_category, video_id: video.id, category_id: nil).should_not be_valid
  		FactoryGirl.build(:video_category, video_id: nil, category_id: category.id).should_not be_valid
  		FactoryGirl.build(:video_category, video_id: nil, category_id: nil).should_not be_valid
  	end
  end
end
