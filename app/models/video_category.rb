class VideoCategory < ActiveRecord::Base

	belongs_to :category
	belongs_to :video
	
	validates_presence_of :category
	validates_presence_of :video

	def self.match_video_to_category(video, category=nil)
		if category.present?
			cat = Category.find_by name: category
			video.video_categories.create(category_id: cat.id) if cat.present?
		end
	end
end
