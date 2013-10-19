class CreateVideos < ActiveRecord::Migration
  def change
    create_table :videos do |t|
      t.string :video_url
      t.string :youtube_id
      t.boolean	:private, default: false
      t.timestamps
    end
  end
end
