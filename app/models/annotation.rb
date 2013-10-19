class Annotation < ActiveRecord::Base
	belongs_to :user
	belongs_to :video

	validates_presence_of :user
	validates_presence_of :video
	validates :annotation_type, :start_time, :stop_time, :position, :presence => true
end
