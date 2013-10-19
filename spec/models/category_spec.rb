require 'spec_helper'

describe Category do
  describe "validations" do
  	
  	it "should create a valid caregory record" do
  		FactoryGirl.create(:category, name: "asdfasdf", youtube_id: 123).should be_valid
  	end

  	it "should not create a valid category record with the name of the category or youtube_id missing." do
  		FactoryGirl.build(:category, name: nil, youtube_id: 123).should_not be_valid
  		FactoryGirl.build(:category, name: "asdf", youtube_id: nil).should_not be_valid
  		FactoryGirl.build(:category, name: nil, youtube_id: nil).should_not be_valid
  	end

  end
end
