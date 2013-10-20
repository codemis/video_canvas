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

  describe "methods" do

    it "when a video and a category name is passed in, it should create a valid video category between them" do
      category = FactoryGirl.create(:category, name: "category", youtube_id: 123)
      video = FactoryGirl.create(:video, video_url: "video url", youtube_id: "youtube_id")
      video.video_categories.length.should == 0
      VideoCategory.match_video_to_category(video, "category")
      video.video_categories.length.should == 1
      video.video_categories.first.category.should == category
    end

    it "should not create a video category between a video and a category if a category is not passed in " do
      category = FactoryGirl.create(:category, name: "category", youtube_id: 123)
      video = FactoryGirl.create(:video, video_url: "video url", youtube_id: "youtube_id")
      video.video_categories.length.should == 0
      VideoCategory.match_video_to_category(video)
      video.video_categories.length.should == 0
    end

    it "should create the category and video category if a category is passed in that is not in the database" do
      category = FactoryGirl.create(:category, name: "category", youtube_id: 123)
      video = FactoryGirl.create(:video, video_url: "video url", youtube_id: "youtube_id")
      video.video_categories.length.should == 0
      VideoCategory.match_video_to_category(video, "categorynotindatabse")
      video.video_categories.length.should == 1
    end


  end
end
