class CreateAnnotations < ActiveRecord::Migration
  def change
  	enable_extension "hstore"
    create_table :annotations do |t|
      t.integer :video_id
      t.integer :user_id
      t.string :annotation_type
      t.integer :start_time
      t.integer :stop_time
      t.hstore :position
      t.text :content
      t.timestamps
    end
  end
end
