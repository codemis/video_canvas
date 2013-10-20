require 'base64'

class AnnotationsController < ApplicationController

	before_filter :set_scribble_data, only: [:create, :update]
	before_filter :set_annotation, only: [:destroy, :update, :show]

	# GET /annotations/:id
	#
	def show
		respond_to do |format|
			format.json { render json: @annotation }
		end
	end
	
	# POST /annotations
	#
	def create
		# TODO Temp code needs cleaning up
		passed_params = annotation_params
		passed_params[:user] = current_user
		passed_params[:video] = Video.find(params[:annotation][:video_id])
		params[:annotation].delete(:video_id)
		@annotation = Annotation.new(passed_params)

		respond_to do |format|
			if @annotation.save
				unless @scribble_data.nil?
					unless @annotation.save_scribble_image(@scribble_data)
						format.json { render json: {error: true, message: "Unable to save the file."} }	
					end
				end
				format.json { render json: @annotation, status: :created, location: @annotation }
			else
				@message = @annotation.errors.empty? ? "Your Annotation has not been saved" : "Your Annotation has not been saved because: " + @annotation.errors.full_messages.to_sentence
				format.json { render json: {error: true, message: @message} }
			end
		end
	end

	# PATCH /annotations/:id
	#
	def update
		respond_to do |format|
			passed_params = annotation_params
			passed_params[:user] = current_user
			passed_params[:video] = Video.find(params[:annotation][:video_id])
			if @annotation.update_attributes(passed_params)
				unless @scribble_data.nil?
					unless @annotation.save_scribble_image(@scribble_data)
						format.json { render json: {error: true, message: "Unable to save the file."} }	
					end
				end
				format.json { render json: @annotation, status: :created, location: @annotation }
			else
				@message = @annotation.errors.empty? ? "Your Annotation has not been saved" : "Your Annotation has not been saved because: " + @annotation.errors.full_messages.to_sentence
				format.json { render json: {error: true, message: @message} }
			end
		end		
	end

	# DELETE /annotations/:id
	#
	def destroy
		if @annotation.annotation_type == 'scribble'
			File.delete(@annotation.content)
		end
		@annotation.destroy

		respond_to do |format|
			format.json { head :no_content }
		end	
	end

	private
		# Sets the curent annotation
		#
		def set_annotation
			@annotation = Annotation.find(params[:id])
		end

		# Set the strong params
		#
		def annotation_params
			params.require(:annotation).permit(:video, :annotation_type, :start_time, :stop_time, :scribble_data, {position: [:x1, :y1, :height, :width]})
		end

		# Sets the Canvas data if a canvas type
		#
		def set_scribble_data
			if params[:annotation][:annotation_type] == 'scribble'
				@scribble_data = params[:annotation][:scribble_data]
				params[:annotation].delete(:scribble_data)
			else
				@scribble_data = nil
			end
		end

end
