# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :annotation do
  end
  factory :defaulted_annotation, parent: :annotation do
  	annotation_type "text"
  	start_time 1
  	stop_time 10
  end
  factory :position_annotation, parent: :annotation do
  	annotation_type "text"
  	start_time 1
  	stop_time 10
  	position {{:x => 13, :y => 15, :width => 230, :height => 500}}
  end
end
