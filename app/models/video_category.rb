class VideoCategory < ActiveRecord::Base

	belongs_to :category
	belongs_to :video
	
	validates_presence_of :category
	validates_presence_of :video
end
