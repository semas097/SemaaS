# Parametarski Blender skript za generaciju potkrovne kuhinje + 4K render.
# Pokretanje:
#   blender --background --python blender_generate_kitchen.py
# Rezultat:
#   - render_4k.jpg (3840x2160)
#   - scene.blend

import bpy, json, math, os

CFG_FILE = "render_config.json"

def mm(v): return v / 1000.0

def clean_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for block in bpy.data.meshes:
        try:
            bpy.data.meshes.remove(block)
        except: pass

def set_units():
    s = bpy.context.scene
    s.unit_settings.system = 'METRIC'
    s.unit_settings.scale_length = 1.0

def create_material(name, base_color, rough=0.9, metal=0.0, spec=0.2):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nodes = m.node_tree.nodes
    bsdf = nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*base_color,1)
    bsdf.inputs["Roughness"].default_value = rough
    bsdf.inputs["Metallic"].default_value = metal
    bsdf.inputs["Specular"].default_value = spec
    return m

def add_box(name, size, loc=(0,0,0), mat=None):
    bpy.ops.mesh.primitive_cube_add(location=loc)
    o = bpy.context.active_object
    o.name = name
    o.scale = (size[0]/2, size[1]/2, size[2]/2)
    bpy.ops.object.transform_apply(scale=True)
    if mat:
        o.data.materials.append(mat)
    return o

def add_plane(name, size, loc=(0,0,0), rot=(0,0,0), mat=None):
    bpy.ops.mesh.primitive_plane_add(location=loc, rotation=rot)
    o = bpy.context.active_object
    o.name = name
    o.scale = (size[0]/2, size[1]/2, 1)
    bpy.ops.object.transform_apply(scale=True)
    if mat:
        o.data.materials.append(mat)
    return o

def build_scene(cfg):
    wall_length = mm(cfg["wall_length_mm"])
    room_depth = mm(cfg["room_depth_mm"])
    worktop_h = mm(cfg["worktop_height_mm"])
    worktop_t = mm(cfg["worktop_thickness_mm"])
    backsplash_h = mm(cfg["backsplash_height_mm"])
    column_pos = mm(cfg["column_pos_mm"])
    column_size = mm(cfg["column_size_mm"])
    cab_depth = mm(cfg["cabinet_depth_mm"])
    upper_h = mm(cfg["upper_cabinet_height_mm"])
    upper_depth = mm(cfg["upper_cabinet_depth_mm"])
    island_L, island_W, island_H = [mm(x) for x in cfg["island_size_mm"]]
    island_top_t = mm(cfg["island_top_thickness_mm"])
    clearance = mm(cfg["clearance_mm"])
    tall_block_w = mm(cfg["tall_block_width_mm"])
    modules_seq = [mm(x) for x in cfg["modules_sequence_mm"]]

    mat_black = create_material("MAT_BLACK", (0.02,0.02,0.02), rough=0.85)
    mat_oak = create_material("MAT_OAK", (0.45,0.32,0.18), rough=0.55)
    mat_concrete = create_material("MAT_CONCRETE", (0.4,0.4,0.38), rough=0.95)
    mat_floor = create_material("MAT_FLOOR", (0.58,0.45,0.28), rough=0.6)

    add_plane("FLOOR", (wall_length, room_depth), loc=(wall_length/2, room_depth/2,0), mat=mat_floor)

    wall_th = 0.05
    add_box("BACK_WALL", (wall_length, wall_th, 3.0), loc=(wall_length/2, -wall_th/2, 3.0/2), mat=mat_black)

    add_box("COLUMN", (mm(column_size), mm(column_size), 2.9), loc=(column_pos + mm(column_size)/2, cab_depth/2, 2.9/2), mat=mat_concrete)

    base_z = worktop_h - worktop_t
    cursor_x = 0.0
    for w in [tall_block_w] + modules_seq:
        depth = cab_depth
        height = base_z
        name = f"BASE_{int(w*1000)}"
        add_box(name, (w, depth, height), loc=(cursor_x + w/2, depth/2, height/2), mat=mat_black)
        cursor_x += w
        if cursor_x > column_pos:
            break

    add_box("WORKTOP", (cursor_x, cab_depth, worktop_t), loc=(cursor_x/2, cab_depth/2, worktop_h - worktop_t/2), mat=mat_oak)
    add_box("BACKSPLASH", (cursor_x, 0.02, mm(cfg["backsplash_height_mm"])), loc=(cursor_x/2, cab_depth - 0.01, base_z + mm(cfg["backsplash_height_mm"])/2), mat=mat_oak)

    upper_bottom = worktop_h + mm(cfg["backsplash_height_mm"]) + 0.09
    cursor_x2 = tall_block_w
    for w in modules_seq:
        name = f"UP_{int(w*1000)}"
        add_box(name, (w, upper_depth, upper_h), loc=(cursor_x2 + w/2, upper_depth/2, upper_bottom + upper_h/2), mat=mat_black)
        cursor_x2 += w
        if cursor_x2 > column_pos: break

    island_x = max(0.1, (column_pos - island_L) / 2)
    island_y = cab_depth + clearance + island_W/2
    add_box("ISLAND_BASE", (island_L, island_W, island_H - island_top_t), loc=(island_x + island_L/2, island_y, (island_H - island_top_t)/2), mat=mat_black)
    add_box("ISLAND_TOP", (island_L, island_W, island_top_t), loc=(island_x + island_L/2, island_y, island_H - island_top_t/2), mat=mat_oak)

    ck_w = 0.8
    ck_d = 0.52
    add_box("COOKTOP", (ck_w, ck_d, 0.01), loc=(island_x + island_L/2, island_y, island_H - island_top_t + 0.005), mat=create_material("MAT_COOK", (0.05,0.05,0.05), rough=0.4))

    ceil_th = 0.04
    h_high = 2.65
    h_low = 1.85
    bpy.ops.mesh.primitive_plane_add(location=(wall_length/2, room_depth/2, h_high))
    ceiling = bpy.context.active_object
    ceiling.name = "CEILING"
    ceiling.scale = (wall_length/2, room_depth/2, 1)
    slope_angle = math.atan2(h_high - h_low, room_depth)
    ceiling.rotation_euler[0] = slope_angle
    ceiling.data.materials.append(mat_oak)

    led_mat = bpy.data.materials.new("MAT_LED")
    led_mat.use_nodes = True
    nodes = led_mat.node_tree.nodes
    out = nodes.get("Material Output")
    em = nodes.new("ShaderNodeEmission")
    em.inputs['Color'].default_value = (1.0,0.8,0.55,1)
    em.inputs['Strength'].default_value = 8
    led_mat.node_tree.links.new(em.outputs[0], out.inputs[0])
    led = add_box("LED_STRIP", (cursor_x, 0.01, 0.015), loc=(cursor_x/2, 0.02, worktop_h + mm(cfg["backsplash_height_mm"]) + 0.02), mat=led_mat)

def setup_camera_and_lights(cfg):
    import math
    bpy.ops.object.camera_add(location=(-2.0, 6.5, 1.9))
    cam = bpy.context.active_object
    cam.name = "CAMERA_MAIN"
    cam.data.lens = 28
    cam.rotation_euler = (math.radians(80), 0, math.radians(-95))
    bpy.context.scene.camera = cam

    bpy.ops.object.light_add(type='AREA', location=(-0.5, 2.5, 1.4))
    al = bpy.context.active_object
    al.data.energy = 1800
    al.data.size = 3.0
    al.name = "AREA_WINDOW"

    bpy.ops.object.light_add(type='AREA', location=(3.0, -1.0, 2.0))
    fill = bpy.context.active_object
    fill.data.energy = 400
    fill.data.size = 2.0
    fill.name = "FILL"

def configure_render(cfg):
    sc = bpy.context.scene
    sc.render.engine = 'BLENDER_EEVEE' if not cfg.get("use_cycles", False) else 'CYCLES'
    sc.render.filepath = os.path.join(os.getcwd(), "render_4k.jpg")
    sc.render.image_settings.file_format = 'JPEG'
    sc.render.image_settings.quality = 95
    sc.render.resolution_x = cfg.get("resolution_x", 3840)
    sc.render.resolution_y = cfg.get("resolution_y", 2160)
    sc.render.resolution_percentage = 100
    if sc.render.engine == 'CYCLES':
        sc.cycles.samples = cfg.get("samples_cycles", 256)
        sc.cycles.feature_set = 'SUPPORTED'
        try:
            sc.cycles.device = 'GPU'
        except: pass
    else:
        sc.eevee.taa_render_samples = cfg.get("samples_eevee", 128)
    sc.view_settings.view_transform = 'Filmic'
    sc.view_settings.look = cfg.get("contrast", "Medium Contrast")
    sc.view_settings.exposure = cfg.get("exposure", 0.0)

def main():
    with open(CFG_FILE,'r') as f:
        cfg = json.load(f)
    clean_scene()
    set_units()
    build_scene(cfg)
    setup_camera_and_lights(cfg)
    configure_render(cfg)
    bpy.ops.wm.save_mainfile(filepath="scene.blend")
    bpy.ops.render.render(write_still=True)

if __name__ == "__main__":
    main()