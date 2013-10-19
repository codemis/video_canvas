# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :video do
  end
  factory :defaulted_video, parent: :video do
  	video_url "http://www.fakewebsite.com"
  	youtube_id "8675309"
  end
end
