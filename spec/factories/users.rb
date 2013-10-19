FactoryGirl.define do
  factory :user do
  end
  factory :defaulted_user, parent: :user do
  	username "username"
  	avatar_text "avatar text"
  end
end
